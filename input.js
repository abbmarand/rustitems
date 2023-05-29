import { calculateCost } from "./src/calculateCost.js"
import { calculateRecycle } from "./src/calculateRecycle.js"
import readline from 'readline'
async function craftItem (input) {
    const args = input.split(" ")
    const item = args[1]
    const quantity = parseInt(args[2])

    if (isNaN(quantity)) {
        return ("please enter in this format (!craft {name} {amount})")
    }

    try {
        const cost = await calculateCost(item, quantity)
        if (quantity === 1) {
            return `the cost to craft ${quantity} ${item} is ${cost}`
        } else {
            return `the cost to craft ${quantity} ${item}s is ${cost}`
        }
    } catch (error) {
        console.log(error)
    }
}

async function recycleItem (input) {
    const args = input.split(" ")
    const item = args[1]
    const quantity = parseInt(args[2])

    if (isNaN(quantity)) {
        return ("please enter in this format (!craft {name} {amount})")
    }

    try {
        const cost = await calculateRecycle(item, quantity)
        if (quantity === 1) {
            return `you will most likely get ${cost} from recycling ${quantity} ${item}`
        } else {
            return `you will most likely ${cost} from recycling ${quantity} ${item}s`
        }
    } catch (error) {
        console.log(error)
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function askQuestion () {
    rl.question('', async name => {
        let message
        if (name.startsWith("!craft")) {
            message = await craftItem(name)
        }
        if (name.startsWith("!recycle")) {
            message = await recycleItem(name)
        }
        if (message !== undefined) {
            console.log(message)
        }
        askQuestion() // ask the question again after handling the input
    })
}
askQuestion() // start the loop
