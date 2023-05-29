import puppeteer from 'puppeteer'
import { getItemByName } from './src/getItemCraftData.js'
import { getItemNames } from './src/getItemNames.js'
import * as fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

//opens a new browser
const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
})
if (!existsSync('data')) {
    fs.mkdir('data')
}
fs.writeFile('./data/items.json', '', function () { console.log('cleared file') })

const itemnames = await getItemNames(browser)

let allitemcosts = {}

let scrapecount = 0
const scrapelen = itemnames.length
let totaltime = 0
for (const item of itemnames) {
    const startTime = performance.now()
    scrapecount += 1
    const { name, group } = item
    const iteminfo = await getItemByName(name, browser)
    const updatedIteminfo = { group, ...iteminfo }
    allitemcosts[name] = updatedIteminfo
    const endTime = performance.now() - startTime
    console.log(`scraped item ${scrapecount}/${scrapelen} (took ${endTime / 1000} seconds)`)
    totaltime += endTime
}
fs.writeFile('./data/items.json', JSON.stringify(allitemcosts), (err) => {
    if (err) throw err
})
console.log(`finished scraping in ${totaltime / 60000} seconds`)

browser.close()