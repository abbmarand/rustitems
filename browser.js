import puppeteer from 'puppeteer'
import { getItemByName } from './getItemByName.js'
import { getItemNames } from './getItemNames.js'
import * as fs from 'node:fs/promises'
//opens a new browser
const browser = await puppeteer.launch({
    headless: true,//"new"
    defaultViewport: null,
})
fs.writeFile('items.json', '', function () { console.log('cleared file') })
const itemnames = await getItemNames(browser)
let allitemcosts = []
let scrapecount = 0
const scrapelen = itemnames.length
for (const itemname of itemnames) {
    scrapecount += 1
    console.log(`scraping item ${scrapecount}/${scrapelen} ...`)
    const iteminfo = await getItemByName(itemname, browser)
    allitemcosts.push({ itemname, iteminfo })
    fs.writeFile('items.json', JSON.stringify(allitemcosts), (err) => {
        if (err) throw err
    })
}
//runs the imported function and inputs the browser and the hardcoded item name
browser.close()