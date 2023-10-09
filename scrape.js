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
//if the datafolder doesn't exist, crate it
if (!existsSync('data')) {
    fs.mkdir('data')
}
//clear the file
fs.writeFile('./data/itemsbyname.json', '', function () { console.log('cleared file') })
fs.writeFile('./data/itemsbyid.json', '', function () { console.log('cleared file') })
fs.writeFile('./data/itemsbyshortname.json', '', function () { console.log('cleared file') })

//get all the itemnames and run the craft and recycle data for every item
const itemnames = await getItemNames(browser)
let byname = {}
let byid = {}
let byshortname = {}
let scrapecount = 0
const scrapelen = itemnames.length
let totaltime = 0
for (const item of itemnames) {
    const startTime = performance.now()
    scrapecount += 1
    const { name, group } = item
    const iteminfo = await getItemByName(name, browser)
    const updatedIteminfo = { group, ...iteminfo }
    byname[name] = updatedIteminfo
    byid[iteminfo.identifier] = updatedIteminfo
    byshortname[iteminfo.shortname] = updatedIteminfo
    const endTime = performance.now() - startTime
    console.log(`scraped item: ${name} (${scrapecount}/${scrapelen}) in ${(endTime / 1000).toFixed(3)} seconds`)
    totaltime += endTime
}

//when done, write the data to a file
fs.writeFile('./data/itemsbyname.json', JSON.stringify(byname), (err) => {
    if (err) throw err
})
fs.writeFile('./data/itemsbyid.json', JSON.stringify(byid), (err) => {
    if (err) throw err
})
fs.writeFile('./data/itemsbyshortname.json', JSON.stringify(byshortname), (err) => {
    if (err) throw err
})
console.log(`finished scraping in ${(totaltime / 60000).toFixed(2)} minutes`)

browser.close()