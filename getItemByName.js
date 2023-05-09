function parseXint(str) {
    let int = 1
    if (str === '') {
        str = 'x1'
    }
    str = str.substring(1)//remove the x so it can be parsed into a number
    str = parseInt(str, 10)
    int = str
    return int
}


async function checkIfCrafteble(page) {
    const tabholder = await page.$('[data-name="craft"]')
    if (tabholder === null) {
        return false
    } else {
        return true
    }
}


async function getYieldAmount(page) {
    const yieldElement = await page.$('td.item-cell')
    if (yieldElement === undefined) {
        return 1
    }
    const yieldTextElement = await page.$('td.item-cell span.text-in-icon')
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


async function getItemCost(page) {
    const craftItemBox = await page.$('div.tab-page.tab-table[data-name="craft"]')
    const tdElement = await page.$('td.no-padding[data-value]')
    let totalCraftCost = await tdElement.evaluate(el => el.getAttribute('data-value'))
    if (totalCraftCost < 5) {
        totalCraftCost = 100000
    }
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
            console.log(`countedcost(${countedCost}) is larger or equal than totalcraftcost(${totalCraftCost})`)
            break
        }
        prevtypes.push(type)
        craftCost.push({ type, amount })
    }
    return craftCost
}


async function scrapeItemInfo(page) {
    const yieldAmount = await getYieldAmount(page)
    const craftCost = await getItemCost(page)
    return { "yield": yieldAmount, "recepie": craftCost }
}


//takes the desired itemname and the browser as an input
//then it opens a new page corrosponding to the item and scrapes the cost for that item
async function getItemByName(name, browser) {
    const page = await browser.newPage()
    try {
        await page.goto(`https://rustlabs.com/item/${name}`, {
            waitUntil: "domcontentloaded",
        })
        let cost
        const scrapeble = await checkIfCrafteble(page)
        if (scrapeble) {
            cost = await scrapeItemInfo(page)
        } else {
            cost = {}
        }
        page.close()
        return cost
    } catch (error) {
        console.log(`failed to scrape data of ${name} (${error})`)
        page.close()
        return {}
    }
}


export { getItemByName }