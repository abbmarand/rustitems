export function parseItemString(str) {
    const lowerstr = str.toLowerCase() // Convert the string to lowercase
    let replaced = lowerstr.replace(/\s+/g, '-') // Replace whitespace with hyphens
    replaced = replaced.replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    replaced = replaced.replace(/é/g, 'e') // Replace 'é' with 'e'
    return replaced
}

// Function to retrieve unique group names from an array of strings
function getGroupNames(array) {
    const groups = array.map(str => str.replace(/\/group=(\w+)/, '$1')) // Extract group names from strings
    const uniqueGroups = [...new Set(groups)] // Get unique group names
    return uniqueGroups
}

async function scrapeItemsWithGroup(page) {
    const itemGroups = []
    const itemTypeslist = await page.$$('li[style="width: auto; white-space: nowrap;"]') // Get list items

    for (const item of itemTypeslist) {
        try {
            const aElement = await item.$('a') // Find anchor element
            const hrefValue = await page.evaluate(aElement => aElement.getAttribute('href'), aElement) // Get href attribute value
            itemGroups.push(hrefValue) // Add href value to itemGroups array
        } catch {
            // Handle any errors
        }
    }
    return itemGroups
}

async function scrapeItemsNames(page) {
    const itemarr = await page.$$('span.r-cell') // Get list of elements with class 'r-cell'
    let itemtext
    let itemtextarr = []
    for (const item of itemarr) {
        itemtext = await page.evaluate(item => item.innerText, item) // Get inner text of item element
        const formatedstr = parseItemString(itemtext) // Format the string using parseItemString function
        itemtextarr.push(formatedstr) // Add formatted string to itemtextarr array
    }
    return itemtextarr
}

async function getItemNames(browser) {
    const page = await browser.newPage()
    await page.goto(`https://wiki.rustclash.com/group=itemlist`, {
        waitUntil: "domcontentloaded",
    })

    //scrape all the group names of items and then scrape all the items within the groups
    const items = []
    const itemGroups = await scrapeItemsWithGroup(page)
    const itemGroupNames = getGroupNames(itemGroups)

    //iterate trough every group and for every group iterate trough every item of that group and for every item push to the itemslist 
    //the name of the item and the group
    for (let i = 0; i < itemGroups.length; i++) {
        try {
            await page.goto(`https://wiki.rustclash.com${itemGroups[i]}`, {
                waitUntil: "domcontentloaded",
            })

            const groupItems = await scrapeItemsNames(page)
            groupItems.forEach(item => {
                items.push({
                    name: item,
                    group: itemGroupNames[i]
                })
            })
        } catch (e) {
            console.log(`failed to scrape items with group: ${itemGroups[i]}`)
        }
    }
    await page.close()
    return items // Return the items array
}

export { getItemNames }
