import { calculateCost } from "./calculateCost.js"
import readline from 'readline'
async function craftItem(input) {
    const args = input.split(" ")
    const item = args[1]
    const quantity = parseInt(args[2])

    if (isNaN(quantity)) {
        return ("please enter in this format (!craft {name} {amount})")
    }

    try {
        const cost = await calculateCost(item, quantity);
        if (quantity === 1) {
            return `The cost to craft ${quantity} ${item} is ${cost}.`;
        } else {
            return `The cost to craft ${quantity} ${item}s is ${cost}.`;
        }
    } catch (error) {
        console.log(error);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function askQuestion() {
    rl.question('', async name => {
        const message = await craftItem(name)
        if (message) {
            console.log(message)
        }
        askQuestion() // ask the question again after handling the input
    })
}
askQuestion() // start the loop
