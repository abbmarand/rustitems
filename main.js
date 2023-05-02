import puppeteer from "puppeteer";

async function scrapeCraftCost(page) {
    const typeElements = await page.$$('a.item-box img');
    const amountElements = await page.$$('a.item-box span.text-in-icon');

    const craftCost = [];

    for (let i = 0; i < typeElements.length; i++) {
        const typeElement = typeElements[i];
        const amountElement = amountElements[i];

        const type = await page.evaluate(typeElement => typeElement.getAttribute('alt'), typeElement);//the alt of the image is the ingame item name
        let amount = await page.evaluate(amountElement => amountElement.innerText, amountElement);
        if (amount === '') {
            amount = 'x1'
        }
        amount = amount.substring(1)//remove the x so it can be parsed into a number
        amount = parseInt(amount, 10)
        if (isNaN(amount)) {//on this website the workbench tier comes after the items requred to craft and the tier is displayed like this (III) which is not parseble into an int
            break;//this means that breaking when that is true will return only the items that are requred to craft it
        }
        craftCost.push({ type, amount });
    }
    console.log(craftCost)
    return craftCost;
}
const getItemByName = async (name) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto(`https://rustlabs.com/item/${name}#tab=craft`, {
        waitUntil: "domcontentloaded",
    });
    scrapeCraftCost(page)
};
getItemByName("chainlink-fence")//try assult-rifle or chainlink-fence
