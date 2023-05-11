import { createMap } from './readData.js'
async function calculateCost (item, amount) {
    const map = await createMap()
    const itemData = map.get(item)
    if (!itemData) {
        console.log(`${item} not found`)
        return
    }
    const recepie = itemData.recepie
    let craftstring = ""
    let firstrun = true
    for (const ingredient of recepie) {
        const ingredientstring = (JSON.stringify(ingredient.amount * amount) + " " + ingredient.type)
        if (firstrun) {
            craftstring += ingredientstring
        } else {
            craftstring += ", " + ingredientstring
        }
        firstrun = false
    }
    return craftstring
}
export { calculateCost }
