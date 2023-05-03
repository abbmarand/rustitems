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

async function scrapeCraftCost(page) {
    const typeElements = await page.$$('a.item-box img')
    const amountElements = await page.$$('a.item-box span.text-in-icon')
    const yieldElement = await page.$('td.item-cell span.text-in-icon')
    let yieldAmount = await page.evaluate(yieldElement => yieldElement.innerText, yieldElement)
    if (yieldAmount === undefined) {
        yieldAmount = 1
    }
    yieldAmount = parseXint(yieldAmount)
    const craftCost = [];
    let prevtype = ""
    for (let i = 0; i < typeElements.length; i++) {
        const typeElement = typeElements[i]
        const amountElement = amountElements[i]

        const type = await page.evaluate(typeElement => typeElement.getAttribute('alt'), typeElement)//the alt of the image is the ingame item name
        let amount = await page.evaluate(amountElement => amountElement.innerText, amountElement)
        amount = parseXint(amount)
        if (isNaN(amount)) {//on this website the workbench tier comes after the items requred to craft and the tier is displayed like this (III) which is not parseble into an int
            break;//this means that breaking when that is true will return only the items that are requred to craft it
        }
        if (type === prevtype) {
            break;//for the case when the crafting doesnt require a workbench
        }
        prevtype = type
        craftCost.push({ type, amount })
    }
    return { "yield": yieldAmount, "recepie": craftCost }
}
//takes the desired itemname and the browser as an input
//then it opens a new page corrosponding to the item and scrapes the cost for that item
async function getItemByName(name, browser) {
    const page = await browser.newPage();
    try {
        await page.goto(`https://rustlabs.com/item/${name}`, {
            waitUntil: "domcontentloaded",
        });
        let cost
        const scrapeble = await checkIfCrafteble(page)
        if (scrapeble) {
            cost = await scrapeCraftCost(page)
        } else {
            cost = {}
        }
        page.close()
        return cost
    } catch (error) {
        console.log(`failed to scrape data of ${name} (${error})`)
        page.close()
    }
}
export { getItemByName }