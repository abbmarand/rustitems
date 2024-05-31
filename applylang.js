import * as fs from 'node:fs/promises'
async function getShortNames(lang, langcode) {
    const hardcoded = JSON.parse(await fs.readFile('specials.json', "utf-8"))
    let itemsbyshortname = JSON.parse(await fs.readFile('data/itemsbyshortname.json', "utf-8"))
    const total = Object.keys(itemsbyshortname).length;
    let totalfound = 0
    const names = {}//map of lists of names
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
        }

    }
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
            notfound[name] = ""
        }

    }
    console.log(`found ${found} of ${total} items in ${langcode} lang`)
    for (const name in names) {
        if (typeof names[name] !== 'string') {
            names[name] = names[name][0]
        }
    }
    return names
}

export async function applyLang(lang, langcode) {
    let itemsbyshortname = JSON.parse(await fs.readFile('data/itemsbyshortname.json', "utf-8"))
    let itemsbyname = JSON.parse(await fs.readFile('data/itemsbyname.json', "utf-8"))
    let itemsbyid = JSON.parse(await fs.readFile('data/itemsbyid.json', "utf-8"))

    const shortnames = await getShortNames(lang, langcode)
    if (langcode === "sv-SE") {

        await fs.writeFile(`data/langdata/shortnames.json`, JSON.stringify(shortnames, null, 2))
    }

    for (const item in itemsbyshortname) {
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
        await fs.writeFile(`data/langdata/itemsbyshortname.${langcode}.json`, JSON.stringify(itemsbyshortname, null, 2))
        await fs.writeFile(`data/langdata/itemsbyname.${langcode}.json`, JSON.stringify(itemsbyname, null, 2))
        await fs.writeFile(`data/langdata/itemsbyid.${langcode}.json`, JSON.stringify(itemsbyid, null, 2))
    } catch (error) {
        console.error(error)
    }
}
