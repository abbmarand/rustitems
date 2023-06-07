import { createMap } from './readData.js'

//takes the item and amount as input and returns a string with information about the cost time and workbench required to craft the item
async function calculateCost (item, amount) {
    //loads the data into a hashmap object and finds the data from the key of the input item
    const map = await createMap()
    const itemData = map.get(item)
    if (!itemData) {
        console.log(`${item} not found`)
        return
    }
    const recipe = itemData.craftData.recipie.craftCost
    const itemyield = itemData.craftData.yield
    let craftstring = ""
    let firstrun = true
    //loops trough every ingredient of the item and adds the item cost and name to the string
    //it adds a comma before every item after the first one
    for (const ingredient of recipe) {
        const ingredientstring = (JSON.stringify(ingredient.amount * (amount / itemyield)) + " " + ingredient.name)
        if (firstrun) {
            craftstring += ingredientstring
        } else {
            craftstring += ", " + ingredientstring
        }
        firstrun = false
    }

    //adds info about the crafting time and next to which workbench that time is achived
    const craftTime = itemData.craftData.craftTime.craftTime
    const workbench = itemData.craftData.workbench
    let workbenchstring = ""
    if (workbench !== 0) {
        workbenchstring = `next to a workbench level ${workbench}`
    }
    craftstring += (` and it will take ${craftTime.long * amount} seconds ${workbenchstring}`)
    return craftstring
}

export { calculateCost }
