import { launch } from 'puppeteer'

(async () => {
    const browser = await launch()
    const page = await browser.newPage()
    await page.goto('https://rustlabs.com/item/assault-rifle#tab=craft')

    const footerHtml = await page.$eval('#two-column-wrap #left-column .tab-block .tab-page .table tbody tr', element => element.innerHTML)
    console.log(footerHtml)
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
})()