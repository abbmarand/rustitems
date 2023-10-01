import { parseItemString } from "./getItemNames.js"
import axios from "axios"
import * as fs from "fs"
import path from "path"
//helper function
function toDecimal(percent) {
    return parseFloat(percent) / 100
}
//helper function
function parseNumber(str) {
    let float = 1
    if (str === '') {
        str = 'x1'
    }
    if (str.endsWith('ft')) {
        const match = str.match(/^[0-9]+/)
        if (match) {
            float = parseInt(match[0], 10)
        }
    } else {
        float = parseInt(str.substring(1), 10)
    }
    if (str.endsWith("%")) {
        float = toDecimal(str)
    }
    return float
}
//check if the page contains a "craft" tab to determine if you can craft the item or not
async function checkIfCrafteble(page) {
    const tabholder = await page.$('[data-name="craft"]')
    if (tabholder === null) {
        return false
    } else {
        return true
    }
}

//finds the element which tells you how many you get from crafting the minimum ammount of the item
async function getYieldAmount(page) {
    const yieldElement = await page.$('div[data-name="craft"] td.item-cell')
    if (yieldElement === undefined) {
        return 1
    }
    //if the element has a span tag in it there will be text like "2x" which is the yield of the item
    //if it doesn't have a span it means there is no information about the yield and means the yield is equal to one
    const hasSpanTag = await page.$eval('div[data-name="craft"] td.item-cell', (element) => {
        return element.querySelector('span') !== null
    })
    if (hasSpanTag) {
        const yieldTextElement = await page.$('div[data-name="craft"] td.item-cell span.text-in-icon')
        if (yieldTextElement === null || yieldTextElement === undefined) {
            return 1
        }
        let yieldAmount = await page.evaluate((yieldTextElement) => yieldTextElement.innerText, yieldTextElement)
        if (yieldAmount === undefined) {
            yieldAmount = 1
        }
        yieldAmount = parseNumber(yieldAmount)
        return yieldAmount
    } else {
        return 1
    }
}

//stack overflow function to check if a number is an int
function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10))
}

//gets the integer identifier for an item which will later be useful as the data recived from rustplus only has item ids and not names
async function getItemIdentifier(page) {
    const cells = await page.$$('table.stats-table td:nth-child(2)')
    for (const cell of cells) {
        const value = await cell.evaluate((node) => Number(node.textContent.trim()))
        if (isInt(value)) {
            return value
        }
    }
    return 0
}

//finds the time to craft the item
async function getItemCraftTime(page) {
    const tdElements = await page.$$('div[data-name="craft"] td[data-value]')
    let craftTime
    for (const tdElement of tdElements) {
        const textContent = await page.evaluate((element) => element.innerText, tdElement)
        if (textContent.includes('sec')) {
            craftTime = textContent
            craftTime = craftTime.replace(' sec', '')
            craftTime = craftTime.split('–')//special character, not the one that exists on normal keyboards, took me 30 minutes to figure out why it didnt work
            if (craftTime.length > 1) {
                const shorterCraftTime = parseFloat(craftTime[0])
                const longerCraftTime = parseFloat(craftTime[1])
                craftTime = { short: shorterCraftTime, long: longerCraftTime }
            } else {
                const shorterCraftTime = parseFloat(craftTime[0])
                const longerCraftTime = parseFloat(craftTime[0])
                craftTime = { short: shorterCraftTime, long: longerCraftTime }
            }
            //if the short time is larger than the long it means that the long time is in minutes which means it need sto be multilpied
            if (craftTime.short > craftTime.long) {
                craftTime.long = craftTime.long * 60
            }
            return { craftTime }
        }
    }
}

async function getWorkbenchTier(page) {
    const tdElements = await page.$$('div[data-name="craft"] td[data-value]')
    let workbench
    for (const tdElement of tdElements) {
        const textContent = await page.evaluate((element) => element.innerText, tdElement)
        //checks if the string is of the format "III" and if it is the element found is the workbench
        //required as the identifier is not precise enough
        if (/^I+$/.test(textContent)) {
            workbench = textContent
            return workbench
        }
    }
}

//gets the cost for an item
async function getItemCost(page) {
    const craftItemBox = await page.$('div.tab-page.tab-table[data-name="craft"]')
    const tdElement = await page.$('div[data-name="craft"] td.no-padding[data-value]')
    let totalCraftCost = await tdElement.evaluate(el => el.getAttribute('data-value'))
    const typeElements = await craftItemBox.$$('a.item-box img')
    const amountElements = await craftItemBox.$$('a.item-box span.text-in-icon')
    const craftCost = []
    let prevtypes = []
    let countedCost = 0
    for (let i = 0; i < typeElements.length; i++) {
        const typeElement = typeElements[i]
        const amountElement = amountElements[i]
        const type = await page.evaluate(typeElement => typeElement.getAttribute('alt'), typeElement)//the alt of the image is the ingame item name
        let amount = await page.evaluate(amountElement => amountElement.innerText, amountElement)
        amount = parseNumber(amount)
        if (isNaN(amount)) {//on this website the workbench tier comes after the items requred to craft and the tier is displayed like this (III) which is not parseble into an int
            break//this means that breaking when that is true will return only the items that are requred to craft it
        }
        if (prevtypes.includes(type)) {
            break//for the case when the crafting doesnt require a workbench
        }
        countedCost += amount
        if (totalCraftCost === countedCost || countedCost > totalCraftCost) {
            //console.log(`countedcost(${countedCost}) is larger or equal than totalcraftcost(${totalCraftCost})`) //debug
            break
        }
        prevtypes.push(type)
        const name = parseItemString(type)
        craftCost.push({ name, amount })
    }
    totalCraftCost = parseInt(totalCraftCost)
    return { totalCraftCost, craftCost }
}

//uses all the functions above and returns an object with all the data recived
async function scrapeItemInfo(page) {
    let workbench
    const workbenchTier = await getWorkbenchTier(page)
    if (workbenchTier === null || workbenchTier === null) {
        workbench = 0
    } else {
        try {
            workbench = (workbenchTier.match(/I/g) || []).length//counts the ammount of I in the string
        } catch {
            workbench = 0
        }
    }
    const craftTime = await getItemCraftTime(page)
    const yieldAmount = await getYieldAmount(page)
    const craftCost = await getItemCost(page)
    return { "yield": yieldAmount, "workbench": workbench, "craftTime": craftTime, "recipie": craftCost }
}

//finds the yield from recyling an item
//does the same as finding the ammount for crafting an item but checks in the recyle tab instead of the crafting tab
async function getRecycleYield(page) {
    const recycleElement = await page.$('div.tab-page.tab-table[data-name="recycle"]')
    if (!recycleElement) {
        return {}
    } else {
        const itemBoxElements = await recycleElement.$$('a.item-box')
        const recycleCost = []
        for (let i = 0; i < itemBoxElements.length; i++) {
            const itemBoxElement = itemBoxElements[i]
            let itemName = await itemBoxElement.$eval('img', (img) => img.getAttribute('alt'))
            itemName = parseItemString(itemName)
            let itemAmount = await page.evaluate(itemBoxElement => itemBoxElement.innerText, itemBoxElement)
            itemAmount = parseNumber(itemAmount)
            recycleCost.push({ name: itemName, amount: itemAmount })
        }
        return { recycleYield: recycleCost }
    }
}

//saves the for an item which might be usefule later
//as said I am focusing to get as much and accurate data as possible as it will be used in future projects
async function downloadImage(imageDownloadLink, folderPath, shortname) {
    try {
        const response = await axios.get(imageDownloadLink, { responseType: 'arraybuffer' })
        const imagePath = path.join(folderPath, shortname)
        fs.writeFileSync(`${imagePath}.png`, response.data)
    } catch (error) {
        console.error('Error downloading image:', error)
    }
}

async function getItemImage(page) {
    const imageDownloadLink = await page.$eval('img.main-icon', (img) => img.getAttribute('src'))
    let imageName = await page.$eval('img.main-icon', (img) => img.getAttribute('alt'))
    const filename = imageDownloadLink.split('/').pop();
    // Extract the part you need by removing the '.png' extension
    const shortname = filename.substring(0, filename.lastIndexOf('.'));
    const folderPath = './data/images' // Specify the folder where you want to save the images

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
    }
    imageName = parseItemString(imageName)
    await downloadImage(imageDownloadLink, folderPath, shortname)
}
async function getItemDescription(page) {
    const descriptionObject = await page.$('p.description')
    const descriptionText = await page.evaluate(element => element.innerText, descriptionObject)
    return descriptionText
}

async function getItemShortname(page) {
    let imageDownloadLink = await page.$eval('img.main-icon', (img) => img.getAttribute('src'))
    // Extract the filename from thke URL by splitting and getting the last part
    const filename = imageDownloadLink.split('/').pop();
    // Extract the part you need by removing the '.png' extension
    const shortname = filename.substring(0, filename.lastIndexOf('.'));
    return shortname
}

//takes the desired itemname and the browser as an input
//then it opens a new page corrosponding to the item and scrapes the cost for that item
async function getItemByName(name, browser) {
    let identifier = 0
    //it does open and close a new page for every item which is bad
    const page = await browser.newPage()
    try {
        await page.goto(`https://rustlabs.com/item/${name}`, {
            waitUntil: "domcontentloaded",
        })
        let craftData
        const shortname = await getItemShortname(page)
        const crafteble = await checkIfCrafteble(page)
        const description = await getItemDescription(page)
        if (crafteble) {
            craftData = await scrapeItemInfo(page)
            identifier = await getItemIdentifier(page)//item identifier always exists but not craftrecipie
        } else {
            craftData = {}
            identifier = await getItemIdentifier(page)
        }
        const recycleData = await getRecycleYield(page)
        const a = await getItemImage(page)
        page.close()
        return { identifier, shortname, description, craftData, recycleData }
    } catch (error) {
        console.log(`failed to scrape data of ${name} (${error})`)
        page.close()
        return {}
    }
}


export { getItemByName }