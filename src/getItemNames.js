export function parseItemString (str) {//https://regex-generator.olafneumann.org/
    const lowerstr = str.toLowerCase()//.normalize('NFC')
    let replaced = lowerstr.replace(/\s+/g, '-')
    replaced = replaced.replace(/-+/g, '-') // Replaces multiple --- with one -
    replaced = replaced.replace(/é/g, 'e') // Replaces é with e
    return replaced
}

function getGroupNames (array) {
    const groups = array.map(str => str.replace(/\/group=(\w+)/, '$1'))
    const uniqueGroups = [...new Set(groups)]
    return uniqueGroups
}


async function scrapeItemsWithGroup (page) {
    const itemGroups = []
    const itemTypeslist = await page.$$('li[style="width: auto; white-space: nowrap;"]')

    for (const item of itemTypeslist) {
        try {
            //const itemTypeText = await page.evaluate(item => item.innerText, item)
            const aElement = await item.$('a')
            const hrefValue = await page.evaluate(aElement => aElement.getAttribute('href'), aElement)
            itemGroups.push(hrefValue)
        } catch {

        }
    }
    return itemGroups
}
async function scrapeItemsNames (page) {
    const itemarr = await page.$$('span.r-cell')
    let itemtext
    let itemtextarr = []
    for (const item of itemarr) {
        itemtext = await page.evaluate(item => item.innerText, item)
        const formatedstr = parseItemString(itemtext)
        itemtextarr.push(formatedstr)
    }
    return itemtextarr
}


async function getItemNames (browser) {
    const page = await browser.newPage()
    await page.goto(`https://rustlabs.com/group=itemlist`, {
        waitUntil: "domcontentloaded",
    })
    const items = []
    //onst itemswithoutgroup = await scrapeItemsNames(page)
    const itemGroups = await scrapeItemsWithGroup(page)
    const itemGroupNames = getGroupNames(itemGroups)
    for (let i = 0; i < itemGroups.length; i++) {
        try {

            await page.goto(`https://rustlabs.com${itemGroups[i]}`, {
                waitUntil: "domcontentloaded",
            })
            const groupItems = await scrapeItemsNames(page)
            groupItems.forEach(item => {
                items.push({
                    name: item,
                    group: itemGroupNames[i]
                })
            })
        } catch (e) {
            console.log(`failed to scrape items with group: ${itemGroups[i]}`)
        }
    }
    await page.close()
    return items
}



export { getItemNames }