import * as fs from 'node:fs/promises'
async function getShortNames(lang, langcode) {
    console.log(`Getting shortnames for language ${langcode}...`)
    const hardcoded = JSON.parse(await fs.readFile('specials.json', "utf-8"))
    console.log('Loaded hardcoded special cases')
    let itemsbyshortname = JSON.parse(await fs.readFile('data/itemsbyshortname.json', "utf-8"))
    console.log('Loaded items by shortname')
    const total = Object.keys(itemsbyshortname).length;
    let totalfound = 0
    const names = {}//map of lists of names
    console.log(`Processing ${total} items...`)
    for (const item in itemsbyshortname) {
        let found = false
        for (const langkey in lang) {
            if (langkey === item) {
                names[item] = [...names[item] || [], langkey]
                found = true
                totalfound++
            }
        }

        if (!found) {
            const group = itemsbyshortname[item].group
            const namewithgroup = `${group}.${item}`
            for (const langkey in lang) {
                if (langkey === namewithgroup) {
                    names[item] = [...names[item] || [], langkey]
                    found = true
                    totalfound++

                }
            }
            for (const langkey in lang) {
                const sanitized = langkey.replace(/[._]/g, '');
                if (sanitized === item) {
                    names[item] = [...names[item] || [], langkey]
                    found = true
                    totalfound++
                }
            }

            for (const langkey in lang) {
                const split = langkey.split('.')
                for (const key of split) {
                    if (key === item) {
                        names[item] = [...names[item] || [], langkey]
                        found = true
                        totalfound++
                    }
                }
            }
            for (const langkey in lang) {
                const split = langkey.split('_')
                for (const key of split) {
                    if (key === item) {
                        names[item] = [...names[item] || [], langkey]
                        found = true
                        totalfound++
                    }
                }
            }
            for (const key in lang) {
                const langwithoutdotname = key.replace('.name', '')
                if (langwithoutdotname === item) {
                    names[item] = [...names[item] || [], key]
                    found = true
                    totalfound++
                }
            }
            for (const key in lang) {
                const langwithoutdotname = key.replace('fish.', '')
                if (langwithoutdotname === item) {
                    names[item] = [...names[item] || [], key]
                    found = true
                    totalfound++
                }
            }
            for (const key in lang) {
                const langwithoutdotname = key.replace('.large', '')
                if (langwithoutdotname === item) {
                    names[item] = [...names[item] || [], key]
                    found = true
                    totalfound++
                }
            }
        }

    }
    console.log(`Found ${totalfound} total matches`)
    console.log('Resolving multiple matches...')
    const multiple = {}
    for (const key in names) {
        let resolved = false
        if (names[key].length > 1) {
            const previousmap = {}
            for (const name of names[key]) {
                previousmap[name] = previousmap[name] + 1 || 1
                if (previousmap[name] > 1) {
                    names[key] = name
                    resolved = true
                    break
                }
                if (name.endsWith(`name`)) {
                    names[key] = name
                    resolved = true
                    break
                }
            }
            if (!resolved) {
                console.log(`multiple names for ${key}: ${names[key]}`)
                multiple[key] = names[key]
            }

        }
    }
    console.log('Applying hardcoded overrides...')
    for (const key in hardcoded) {
        names[key] = hardcoded[key]
    }
    const found = Object.keys(names).length;
    let notfound = {}
    for (const name in itemsbyshortname) {
        let found = false
        if (names[name]) {
            found = true
        }
        if (!found) {
            notfound[name] = itemsbyshortname[name]
        }

    }
    console.log(`found ${found} of ${total} items in ${langcode} lang`)
    console.log("Items not found:", notfound);
    console.log('Normalizing array values to strings...')
    for (const name in names) {
        if (typeof names[name] !== 'string') {
            names[name] = names[name][0]
        }
    }
    return names
}

export async function applyLang(lang, langcode) {
    if (!lang || !langcode) {
        throw new Error('Language and language code are required')
    }

    console.log(`Applying language ${langcode}...`)
    console.log('Loading item data files...')
    let itemsbyshortname = JSON.parse(await fs.readFile('data/itemsbyshortname.json', "utf-8"))
    let itemsbyname = JSON.parse(await fs.readFile('data/itemsbyname.json', "utf-8"))
    let itemsbyid = JSON.parse(await fs.readFile('data/itemsbyid.json', "utf-8"))

    console.log('Getting shortnames mapping...')
    const shortnames = await getShortNames(lang, langcode)
    if (langcode === "sv-SE") {
        console.log('Writing shortnames debug file for sv-SE...')
        await fs.writeFile(`data/langdata/shortnames.json`, JSON.stringify(shortnames, null, 2))
    }

    console.log('Processing items by shortname...')
    for (const item in itemsbyshortname) {
        if (!shortnames[item]) {
            console.warn(`Warning: No shortname mapping found for item ${item}`)
            continue
        }
        itemsbyshortname[item].name = lang[shortnames[item]]
        for (const recycleitem in itemsbyshortname[item].recycleData?.recycleYieldsafe) {
            itemsbyshortname[item].recycleData.recycleYieldsafe[recycleitem].name = lang[shortnames[itemsbyshortname[item].recycleData.recycleYieldsafe[recycleitem].name]]
        }
        for (const recycleitem in itemsbyshortname[item].recycleData?.recycleYieldrad) {
            itemsbyshortname[item].recycleData.recycleYieldrad[recycleitem].name = lang[shortnames[itemsbyshortname[item].recycleData.recycleYieldrad[recycleitem].name]]
        }
        for (const craftitem in itemsbyshortname[item].craftData.recipie?.craftCost) {
            itemsbyshortname[item].craftData.recipie.craftCost[craftitem].name = lang[shortnames[itemsbyshortname[item].craftData.recipie.craftCost[craftitem].name]]
        }
    }

    console.log('Processing items by name...')
    for (let item in itemsbyname) {
        const queryitem = itemsbyname[item].shortname
        itemsbyname[item].name = lang[queryitem]
        for (const recycleitem in itemsbyname[item].recycleData?.recycleYieldsafe) {
            itemsbyname[item].recycleData.recycleYieldsafe[recycleitem].name = lang[shortnames[itemsbyname[itemsbyname[item].recycleData.recycleYieldsafe[recycleitem].name].shortname]]
        }
        for (const recycleitem in itemsbyname[item].recycleData?.recycleYieldrad) {
            itemsbyname[item].recycleData.recycleYieldrad[recycleitem].name = lang[shortnames[itemsbyname[itemsbyname[item].recycleData.recycleYieldrad[recycleitem].name].shortname]]
        }
        for (const craftitem in itemsbyname[item].craftData.recipie?.craftCost) {
            itemsbyname[item].craftData.recipie.craftCost[craftitem].name = lang[shortnames[itemsbyname[itemsbyname[item].craftData.recipie.craftCost[craftitem].name].shortname]]
        }
    }

    console.log('Processing items by ID...')
    for (let item in itemsbyid) {
        itemsbyid[item].name = lang[shortnames[itemsbyid[item].shortname]]
        for (const recycleitem in itemsbyid[item].recycleData?.recycleYieldsafe) {
            itemsbyid[item].recycleData.recycleYieldsafe[recycleitem].name = lang[shortnames[itemsbyid[itemsbyid[item].recycleData.recycleYieldsafe[recycleitem].name].shortname]]
        }
        for (const recycleitem in itemsbyid[item].recycleData?.recycleYieldrad) {
            itemsbyid[item].recycleData.recycleYieldrad[recycleitem].name = lang[shortnames[itemsbyid[itemsbyid[item].recycleData.recycleYieldrad[recycleitem].name].shortname]]
        }
        for (const craftitem in itemsbyid[item].craftData.recipie?.craftCost) {
            itemsbyid[item].craftData.recipie.craftCost[craftitem].name = lang[shortnames[itemsbyid[itemsbyid[item].craftData.recipie.craftCost[craftitem].name].shortname]]
        }
    }
    try {
        console.log(`Writing output files for ${langcode}...`)
        await fs.writeFile(`data/langdata/itemsbyshortname.${langcode}.json`, JSON.stringify(itemsbyshortname, null, 2))
        await fs.writeFile(`data/langdata/itemsbyname.${langcode}.json`, JSON.stringify(itemsbyname, null, 2))
        await fs.writeFile(`data/langdata/itemsbyid.${langcode}.json`, JSON.stringify(itemsbyid, null, 2))
        console.log(`Successfully processed language ${langcode}`)
    } catch (error) {
        console.error(`Error writing output files for ${langcode}:`, error)
    }
}
