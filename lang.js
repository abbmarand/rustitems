import { getLangs } from "./src/getlang.js";
import { applyLang } from "./applylang.js";
import * as fs from 'node:fs/promises'
const langs = await getLangs()
for (const lang of langs) {
    console.log(lang)
    const langdata = JSON.parse(await fs.readFile(`./data/lang/${lang}/engine.json`, 'utf-8'))
    const langcode = lang
    await applyLang(langdata, langcode)
}