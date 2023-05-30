# web scraping med puppeteer abbmarand

## Introduction
This project is designed for web scraping and includes a simple data visualization feature. The primary purpose of this project is to collect accurate data for future projects. The scraped data can be used in conjunction with another project of mine, which utilizes the same commands in the game Rust. You can find the other project at [https://github.com/abbmarand/better_rustplus.git](https://github.com/abbmarand/better_rustplus.git).

Please note that the visualization component of this project does not utilize all the scraped data, as the main focus has been on data collection.

## Usage
To get started, follow these steps:

1. Clone the repository from [https://github.com/abbindustrigymnasium/web-scraping-med-puppeteer-abbmarand.git](https://github.com/abbindustrigymnasium/web-scraping-med-puppeteer-abbmarand.git).

```bash
git clone https://github.com/abbindustrigymnasium/web-scraping-med-puppeteer-abbmarand.git
```
run to install all dependacies 
```bash
npm install
``` 
to scrape new data.(takes around 10 minutes)
```bash
node scrape.js
``` 

To use the scraped data, run.
```bash
node input.js
``` 
Alternatively, if you want to use the data specifically for the game Rust, follow the instructions provided in [https://github.com/abbmarand/better_rustplus.git](https://github.com/abbmarand/better_rustplus.git).

Once you have the data, execute the `input.js` file and try the following commands:

- `!craft assault-rifle 2`
- `!recycle assault-rifle 4`
