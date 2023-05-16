function parseItemString (str) {//https://regex-generator.olafneumann.org/
    const lowerstr = str.toLowerCase()//.normalize('NFC')
    let replaced = lowerstr.replace(/\s+/g, '-')
    replaced = replaced.replace(/-+/g, '-') // Replaces multiple --- with one -
    replaced = replaced.replace(/é/g, 'e') // Replaces é with e
    return replaced
}
async function scrapeItemsWithGroup (page) {
    const itemGroups = []
    const itemTypeslist = await page.$$('li [style="width: auto; white-space: nowrap;"]')
    for (const item of itemTypeslist) {
        const itemTypeText = await page.evaluate(item => item.innerText, item)
        itemGroups.push(itemTypeText)
    }
    itemGroups.push("build")//had to hardcode as the construction button lead to the build tab
    return itemGroups
}
async function scrapeItems (page) {
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
    const itemGroups = await scrapeItemsWithGroup(page)
    for (const itemGroup of itemGroups) {
        try {
            await page.goto(`https://rustlabs.com/group=${itemGroup}`, {
                waitUntil: "domcontentloaded",
            })
            const groupItems = await scrapeItems(page)
            groupItems.forEach(item => {
                items.push({
                    name: item,
                    group: itemGroup
                })
            })
        } catch (e) {
            console.log(`failed to scrape items with group: ${itemGroup}`)
        }
    }
    await page.close()
    return items
}



export { getItemNames }