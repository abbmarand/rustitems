
import axios from 'axios';
import 'dotenv/config'
import * as fs from 'node:fs/promises'
let langtouse = []
async function getLanglist() {
    try {
        const response = await axios.get('https://crowdin.com/backend/project/rust/info');
        console.log()
        return response.data.data._crowdin_languages
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getLangData(lang) {
    try {
        console.log(`Downloading ${lang.code}...`)
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en,sv;q=0.8,en-US;q=0.5,sv-SE;q=0.3',
            'Connection': 'keep-alive',
            'Host': 'crowdin.com',
            'Priority': 'u=0, i',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'TE': 'trailers',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
        };
        const cookieString = process.env.COOKIE
        headers.Cookie = cookieString
        const response = await axios.get(`https://crowdin.com/backend/project/rust/${lang.code}/22588/export`, { headers });
        const link = response.data?.url;
        const linkData = await axios.get(link) // No Headers needed when downloading
        if (linkData && linkData?.data) {
            const data = linkData.data;
            await fs.mkdir(`./data/lang/${lang.code}`, { recursive: true });
            await fs.writeFile(`./data/lang/${lang.code}/engine.json`, JSON.stringify(data, null, 2));
            langtouse.push(lang.code)
        } else {
            return
        }


    } catch (error) {
    }
}


async function getLangs() {
    const langs = await getLanglist()
    for (const lang in langs) {
        await getLangData(langs[lang])

    }
    return langtouse
}

export { getLangs }