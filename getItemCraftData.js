function parseXint (str) {
    let int = 1
    if (str === '') {
        str = 'x1'
    }
    if (str.endsWith('ft')) {
        const match = str.match(/^[0-9]+/)
        if (match) {
            int = parseInt(match[0], 10)
        }
    } else {
        int = parseInt(str.substring(1), 10)
    }
    return int
}


async function checkIfCrafteble (page) {
    const tabholder = await page.$('[data-name="craft"]')
    if (tabholder === null) {
        return false
    } else {
        return true
    }
}


async function getYieldAmount (page) {
    const yieldElement = await page.$('div[data-name="craft"] td.item-cell')
    if (yieldElement === undefined) {
        return 1
    }
    const yieldTextElement = await page.$('div[data-name="craft"] td.item-cell span.text-in-icon')
    if (yieldTextElement === null || yieldTextElement === undefined) {
        return 1
    }
    let yieldAmount = await page.evaluate((yieldTextElement) => yieldTextElement.innerText, yieldTextElement)
    if (yieldAmount === undefined) {
        yieldAmount = 1
    }
    yieldAmount = parseXint(yieldAmount)
    return yieldAmount
}

function isInt (value) {//stack overflow
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10))
}

async function getItemIdentifier (page) {
    const cells = await page.$$('table.stats-table td:nth-child(2)')
    for (const cell of cells) {
        const value = await cell.evaluate((node) => Number(node.textContent.trim()))
        if (isInt(value)) {
            return value
        }
    }
    return 0
}

async function getItemCraftTime (page) {
    const tdElements = await page.$$('div[data-name="craft"] td[data-value]')
    let craftTime
    for (const tdElement of tdElements) {
        const textContent = await page.evaluate((element) => element.innerText, tdElement)
        if (textContent.includes('sec')) {
            craftTime = textContent
            return craftTime
        }
    }
}

async function getWorkbenchTier (page) {
    const tdElements = await page.$$('div[data-name="craft"] td[data-value]')
    let workbench
    for (const tdElement of tdElements) {
        const textContent = await page.evaluate((element) => element.innerText, tdElement)
        if (/^I+$/.test(textContent)) {
            workbench = textContent
            return workbench
        }
    }
}


async function getItemCost (page) {
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
        amount = parseXint(amount)
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
        craftCost.push({ type, amount })
    }
    return { totalCraftCost, craftCost }
}


async function scrapeItemInfo (page) {
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
    const crafttime = await getItemCraftTime(page)
    const yieldAmount = await getYieldAmount(page)
    const craftCost = await getItemCost(page)
    return { "yield": yieldAmount, "workbench": workbench, "craft": crafttime, "recepie": craftCost }
}


//takes the desired itemname and the browser as an input
//then it opens a new page corrosponding to the item and scrapes the cost for that item
async function getItemByName (name, browser) {
    let identifier = 0
    const page = await browser.newPage()
    try {
        await page.goto(`https://rustlabs.com/item/${name}`, {
            waitUntil: "domcontentloaded",
        })
        let craftData
        const scrapeble = await checkIfCrafteble(page)
        if (scrapeble) {
            craftData = await scrapeItemInfo(page)
            identifier = await getItemIdentifier(page)//item identifier always exists but not craftrecipie
        } else {
            craftData = {}
            identifier = await getItemIdentifier(page)
        }
        page.close()
        return { identifier, craftData }
    } catch (error) {
        console.log(`failed to scrape data of ${name} (${error})`)
        page.close()
        return {}
    }
}


export { getItemByName }