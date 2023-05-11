function parseItemString (str) {
    const lowerstr = str.toLowerCase()//.normalize('NFC')
    let replaced = lowerstr.replace(/\s+/g, '-')
    replaced = replaced.replace(/-+/g, '-') // Replaces multiple hyphens with a single hyphen
    replaced = replaced.replace(/é/g, 'e') // Replaces é with e
    console.log(replaced)
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