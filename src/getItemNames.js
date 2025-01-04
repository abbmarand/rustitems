export function parseItemString(str) {
    const lowerstr = str.toLowerCase() // Convert the string to lowercase
    let replaced = lowerstr.replace(/\s+/g, '-') // Replace whitespace with hyphens
    replaced = replaced.replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    replaced = replaced.replace(/é/g, 'e') // Replace 'é' with 'e'
    return replaced
}


async function getItemNames(page) {
    await page.goto(`https://wiki.rustclash.com/group=itemlist`, {
        waitUntil: "domcontentloaded",
    })

    const items = []
    console.log('Debugging HTML structure...')

    const elements = await page.$$('div.info-block h2, div.info-block a')
    console.log(`Found ${elements.length} elements`)

    let currentGroup = ''
    const groups = new Set()
    // Object to track first item of each group
    const groupFirstItems = {}

    for (const element of elements) {
        try {
            const tagName = await element.evaluate(el => el.tagName.toLowerCase())

            if (tagName === 'h2') {
                currentGroup = await element.evaluate(el => el.textContent.trim().toLowerCase())
                console.log('\nFound group:', currentGroup)
                groups.add(currentGroup)
            } else if (tagName === 'a') {
                const itemName = await element.evaluate(el => el.getAttribute('href').replace('/item/', ''))
                // Store first item we see for each group
                if (!groupFirstItems[currentGroup]) {
                    groupFirstItems[currentGroup] = itemName
                }
                items.push({
                    name: itemName,
                    group: currentGroup
                })
            }
        } catch (error) {
            console.error('Error processing element:', error)
        }
    }

    // Log all groups with their first items
    console.log('\nGroups and their first items:')
    for (const group of [...groups].sort()) {
        console.log(`${group}: ${groupFirstItems[group]}`)
    }

    console.log(`\nTotal number of groups: ${groups.size}`)
    console.log(`Total number of items: ${items.length}`)

    return items
}

export { getItemNames }

