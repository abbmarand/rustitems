function parseItemString (str) {
    const lowerstr = str.toLowerCase()
    const replaced = lowerstr.replace(/\s/g, '-')
    return replaced
}

async function ScrapeItems (page) {
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
    const items = await ScrapeItems(page)
    page.close()
    return items
}
export { getItemNames }