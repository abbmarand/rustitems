import { createMap } from './readData.js'
async function calculateCost(item, amount) {
    const map = await createMap();
    const itemData = map.get(item);
    if (!itemData) {
        console.log(`${item} not found`);
        return;
    }
    const recipe = itemData.craftData.recipie.craftCost
    const itemyield = itemData.craftData.yield
    let craftstring = "";
    let firstrun = true;
    for (const ingredient of recipe) {

        const ingredientstring = (JSON.stringify(ingredient.amount * (amount / itemyield)) + " " + ingredient.name);
        if (firstrun) {
            craftstring += ingredientstring;
        } else {
            craftstring += ", " + ingredientstring;
        }
        firstrun = false;
    }
    return craftstring;
}

export { calculateCost }
