import { createMap } from './readData.js'
//takes an input of the item and how many there is and return a string about how much and what you get from recycling the item
async function calculateRecycle (item, amount) {
    //loads the data into a hashmap object and finds the data from the key of the input item
    const map = await createMap()
    const itemData = map.get(item)
    if (!itemData) {
        console.log(`${item} not found`)
        return
    }
    const recipe = itemData.recycleData.recycleYield
    let craftstring = ""
    let firstrun = true
    //loops trough every item in the recycledata and adds the item name and ammount to a string
    for (const ingredient of recipe) {

        const ingredientstring = ((JSON.stringify(ingredient.amount * amount)) + " " + ingredient.name)
        if (firstrun) {
            craftstring += ingredientstring
        } else {
            craftstring += ", " + ingredientstring
        }
        firstrun = false
    }
    return craftstring
}

export { calculateRecycle }
