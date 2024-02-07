import { readFile } from 'fs/promises'
//opends the datafile
export async function read() {
    try {
        const data = await readFile('./data/itemsbyname.json', 'utf8')
        return data
    } catch (err) {
        console.error(err)
        return null
    }
}
//creates a hashmap from the data every time the data is read which is very bad
//it is solved in the real usecase of this data where all the code exists in one file and you can check if a global variable is not equal to null
export async function createMap() {
    const allData = await read()
    const jsonData = JSON.parse(allData)
    const map = new Map(Object.entries(jsonData))
    return map
}
