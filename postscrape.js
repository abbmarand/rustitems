import { readFile, writeFile } from 'fs/promises';

export async function updateData() {
    try {
        let byname = await readFile("./data/itemsbyname.json", 'utf8');
        let byid = await readFile("./data/itemsbyid.json", 'utf8');
        let byshortname = await readFile("./data/itemsbyshortname.json", 'utf8');

        byname = JSON.parse(byname);
        byid = JSON.parse(byid);
        byshortname = JSON.parse(byshortname);
        for (const itemId in byid) {
            if (byid.hasOwnProperty(itemId)) {
                const itemInfo = byid[itemId];
                if (itemInfo.recycleData && Array.isArray(itemInfo.recycleData.recycleYieldsafe) && Array.isArray(itemInfo.recycleData.recycleYieldrad)) {
                    itemInfo.recycleData.recycleYieldsafe.forEach((yieldItem) => {
                        const yn = yieldItem.name
                        const nyn = byname[yn].identifier
                        yieldItem.name = nyn
                    });
                    itemInfo.recycleData.recycleYieldrad.forEach((yieldItem) => {
                        const yn = yieldItem.name
                        const nyn = byname[yn].identifier
                        yieldItem.name = nyn
                    });
                }

                if (itemInfo.craftData && itemInfo.craftData.recipie) {
                    itemInfo.craftData.recipie.craftCost.forEach((costItem) => {
                        const yn = costItem.name
                        const nyn = byname[yn].identifier
                        costItem.name = nyn
                    });
                }

            }
        }
        for (const shortName in byshortname) {
            if (byshortname.hasOwnProperty(shortName)) {
                const itemInfo = byshortname[shortName];
                if (itemInfo.recycleData && Array.isArray(itemInfo.recycleData.recycleYieldsafe) && Array.isArray(itemInfo.recycleData.recycleYieldrad)) {

                    if (itemInfo.recycleData && Array.isArray(itemInfo.recycleData.recycleYieldsafe) && Array.isArray(itemInfo.recycleData.recycleYieldrad)) {
                        itemInfo.recycleData.recycleYieldsafe.forEach((yieldItem) => {
                            const yn = yieldItem.name
                            const nyn = byname[yn].shortname
                            yieldItem.name = nyn
                        });
                        itemInfo.recycleData.recycleYieldrad.forEach((yieldItem) => {
                            const yn = yieldItem.name
                            const nyn = byname[yn].shortname
                            yieldItem.name = nyn
                        });

                    }

                    if (itemInfo.craftData && itemInfo.craftData.recipie) {
                        itemInfo.craftData.recipie.craftCost.forEach((costItem) => {
                            const yn = costItem.name
                            const nyn = byname[yn].shortname
                            costItem.name = nyn
                        });
                    }

                }

            }
        }
        await writeFile('./data/itemsbyname.json', JSON.stringify(byname));
        await writeFile('./data/itemsbyid.json', JSON.stringify(byid));
        await writeFile('./data/itemsbyshortname.json', JSON.stringify(byshortname));

        console.log("Data updated and written to files successfully.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

