import puppeteer from 'puppeteer'
import { getItemByName } from './getItemCraftData.js'
import { getItemNames } from './getItemNames.js'
import * as fs from 'node:fs/promises'

//opens a new browser
const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
})

fs.writeFile('items.json', '', function () { console.log('cleared file') })

const itemnames = await getItemNames(browser)

let allitemcosts = {}

let scrapecount = 0
const scrapelen = itemnames.length

for (const item of itemnames) {
    scrapecount += 1
    console.log(`scraping item ${scrapecount}/${scrapelen} ...`)
    const { name, group } = item
    const iteminfo = await getItemByName(name, browser)
    const updatedIteminfo = { group, ...iteminfo }
    allitemcosts[name] = updatedIteminfo
    fs.writeFile('items.json', JSON.stringify(allitemcosts), (err) => {
        if (err) throw err
    })
}


browser.close()