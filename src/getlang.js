
import axios from 'axios';
import * as fs from 'node:fs/promises'
import AdmZip from 'adm-zip';
let langtouse = []
async function getLanglist() {
    try {
        const response = await axios.get('https://crowdin.com/backend/project/rust/info');
        const data = response.data;
        return data.data._crowdin_languages;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getLangData(lang) {
    try {
        const response = await axios.get(`https://crowdin.com/backend/download/project/rust/${lang.code}.zip`, { responseType: 'arraybuffer' });
        const data = response.data;
        const zip = new AdmZip(data);
        zip.extractAllTo(`./data/lang/${lang.code}`);
        langtouse.push(lang.code)

    } catch (error) {
    }
}


async function getLangs() {
    const langs = await getLanglist()
    let promises = []
    for (const lang in langs) {
        promises.push(getLangData(langs[lang]));
    }
    await Promise.all(promises);
    return langtouse
}

export { getLangs }