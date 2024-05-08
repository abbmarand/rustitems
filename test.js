import puppeteer from 'puppeteer'
import { getItemByName } from './src/getItemCraftData.js'
const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
})

const data = await getItemByName("assault-rifle", browser);
console.log(data)
console.log(data.recycleData)
browser.close()

