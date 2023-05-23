import { createMap } from './readData.js'
async function calculateRecycle(item, amount) {
    const map = await createMap();
    const itemData = map.get(item);
    if (!itemData) {
        console.log(`${item} not found`);
        return;
    }
    const recipe = itemData.recycleData.recycleYield
    let craftstring = "";
    let firstrun = true;
    for (const ingredient of recipe) {

        const ingredientstring = ((JSON.stringify(ingredient.amount * amount)) + " " + ingredient.name);
        if (firstrun) {
            craftstring += ingredientstring;
        } else {
            craftstring += ", " + ingredientstring;
        }
        firstrun = false;
    }
    return craftstring;
}

export { calculateRecycle }
