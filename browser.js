import puppeteer from 'puppeteer';
import { getItemByName } from './getItemByName.js'

//opens a new browser
const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
});
//runs the imported function and inputs the browser and the hardcoded item name
const iteminfo = await getItemByName("assault-rifle", browser)
console.log(JSON.stringify(iteminfo))
browser.close()