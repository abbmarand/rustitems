import { readFileSync, writeFileSync } from 'fs';
import axios from 'axios';
import { load } from 'cheerio';
const htmlFilePath = 'emoji.html';
const htmlContent = readFileSync(htmlFilePath, 'utf-8');
const $ = load(htmlContent);
const imgElements = $('li img');
imgElements.each(async (index, imgElement) => {
    const imgSrc = $(imgElement).attr('src');
    let imgAlt = $(imgElement).attr('alt');
    if (imgSrc && imgAlt) {
        imgAlt = imgAlt.substring(1, imgAlt.length - 1);
        try {
            const response = await axios.get(imgSrc, { responseType: 'arraybuffer' });
            imgAlt = imgAlt.substring(4);
            writeFileSync(`../data/emoji/${imgAlt}.jpg`, response.data);
            console.log(`Downloaded ${imgAlt}.jpg`);
        } catch (error) {
            console.error(`Error downloading ${imgSrc}: ${error.message}`);
        }
    }
});
