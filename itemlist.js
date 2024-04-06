import { readFile, writeFile } from 'fs/promises';
export async function itemlist() {
    const byname = await readFile("./data/itemsbyname.json", 'utf8');
    const fullitems = JSON.parse(byname)
    let items = []
    for (const item in fullitems) {
        items.push(item)
    }
    await writeFile('./data/itemlist.txt', JSON.stringify(items));
}
