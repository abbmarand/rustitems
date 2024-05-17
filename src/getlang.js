
import axios from 'axios';
import * as fs from 'node:fs/promises'
import AdmZip from 'adm-zip';

async function getLanglist() {
    try {
        const response = await axios.get('https://crowdin.com/backend/project/rust/info');
        const data = response.data;
        return data.data._crowdin_languages;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getLangData(code) {
    try {
        const response = await axios.get(`https://crowdin.com/backend/download/project/rust/${code}.zip`, { responseType: 'arraybuffer' });
        const data = response.data;
        const zip = new AdmZip(data);
        zip.extractAllTo(`./data/lang/${code}`);
        console.log('File unzipped successfully!');
    } catch (error) {
        console.error('failed to download for country:', code);
    }
}


async function getLangs() { 
    const langs = await getLanglist()
    for(const lang in langs) {
        const l  = await getLangData(langs[lang].code)
    }
}

export { getLangs }