import { readFile } from 'fs/promises'

export async function read () {
    try {
        const data = await readFile('./data/items.json', 'utf8')
        return data
    } catch (err) {
        console.error(err)
        return null
    }
}
export async function createMap () {
    const allData = await read()
    const jsonData = JSON.parse(allData)
    const map = new Map(Object.entries(jsonData))
    return map
}
