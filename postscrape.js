import * as fs from 'node:fs/promises'
let byname = fs.readFile('./data/itemsbyname.json')
let byid = fs.readFile('./data/itemsbyname.json')
let byshortname = fs.readFile('./data/itemsbyname.json')
for (const itemName in byname) {
    if (byname.hasOwnProperty(itemName)) {
        const itemInfo = byname[itemName];

        if (itemInfo.recycleData && Array.isArray(itemInfo.recycleData.recycleYield)) {
            itemInfo.recycleData.recycleYield.forEach((yieldItem) => {
                if (yieldItem.name === itemName) {
                    yieldItem.name = itemInfo.shortname;
                }
            });
        }

        if (itemInfo.craftData && itemInfo.craftData.recipie) {
            itemInfo.craftData.recipie.craftCost.forEach((costItem) => {
                if (costItem.name === itemName) {
                    costItem.name = itemInfo.shortname;
                }
            });
        }
    }
}
for (const itemName in byid) {
    if (byid.hasOwnProperty(itemName)) {
        const itemInfo = byid[itemName];

        if (itemInfo.recycleData && Array.isArray(itemInfo.recycleData.recycleYield)) {
            itemInfo.recycleData.recycleYield.forEach((yieldItem) => {
                if (yieldItem.name === itemName) {
                    yieldItem.name = itemInfo.shortname;
                }
            });
        }

        if (itemInfo.craftData && itemInfo.craftData.recipie) {
            itemInfo.craftData.recipie.craftCost.forEach((costItem) => {
                if (costItem.name === itemName) {
                    costItem.name = itemInfo.shortname;
                }
            });
        }
    }
}
for (const itemName in byshortname) {
    if (byshortname.hasOwnProperty(itemName)) {
        const itemInfo = byshortname[itemName];

        if (itemInfo.recycleData && Array.isArray(itemInfo.recycleData.recycleYield)) {
            itemInfo.recycleData.recycleYield.forEach((yieldItem) => {
                if (yieldItem.name === itemName) {
                    yieldItem.name = itemInfo.shortname;
                }
            });
        }

        if (itemInfo.craftData && itemInfo.craftData.recipie) {
            itemInfo.craftData.recipie.craftCost.forEach((costItem) => {
                if (costItem.name === itemName) {
                    costItem.name = itemInfo.shortname;
                }
            });
        }
    }
}
fs.writeFile('./data/itemsbyname.json', JSON.stringify(byname), (err) => {
    if (err) throw err
})
fs.writeFile('./data/itemsbyid.json', JSON.stringify(byid), (err) => {
    if (err) throw err
})
fs.writeFile('./data/itemsbyshortname.json', JSON.stringify(byshortname), (err) => {
    if (err) throw err
})