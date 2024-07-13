# Rustlabs Webscraping

## Introduction
This project webscrapes the [RustLabs.com](https://rustlabs.com) website for usable itemdata in the game rust such as crafting data and recycling data. 
It also takes data from the official [Rust Crowdin page](https://crowdin.com/project/rust) to translate items

## Usage
To get started, follow these steps:

Clone the ```https://github.com/abbmarand/rustitems.git```.

```bash
git clone https://github.com/abbmarand/rustitems.git
```
run to install all dependacies 
```bash
npm install
``` 
to scrape new data.(takes around 10 minutes)
```bash
node scrape.js
``` 
to apply all the languages
```bash
node lang.js
```
