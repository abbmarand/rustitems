import { getLangs } from "./src/getlang.js";
import { applyLang } from "./applylang.js";
import * as fs from 'node:fs/promises'
//const langs = await getLangs()
//await fs.writeFile(`./data/langs.json`, JSON.stringify(langs, null, 2))
const langs = [
    "ro",
    "fr",
    "es-ES",
    "af",
    "ar",
    "ca",
    "cs",
    "da",
    "de",
    "el",
    "fi",
    "he",
    "hu",
    "it",
    "ja",
    "ko",
    "nl",
    "no",
    "pl",
    "pt-PT",
    "ru",
    "sr",
    "sv-SE",
    "tr",
    "uk",
    "zh-CN",
    "zh-TW",
    "vi",
    "pt-BR",
    "en-PT"
]
for (const lang of langs) {
    console.log(lang)
    const langdata = JSON.parse(await fs.readFile(`./data/lang/${lang}/engine.json`, 'utf-8'))
    const langcode = lang
    await applyLang(langdata, langcode)
}