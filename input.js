import { calculateCost } from "./calculateCost.js"
import readline from 'readline'
function craftItem (input) {
    const args = input.split(" ")
    const item = args[1]
    const quantity = parseInt(args[2])

    if (isNaN(quantity)) {
        console.log("please enter in this format (!craft {name} {amount})")
        return
    }

    calculateCost(item, quantity)
        .then(cost => console.log(`The cost to craft ${quantity} ${item}(s) is ${cost}.`))
        .catch(error => console.log(error))
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
let question = true

function askQuestion () {
    rl.question('', name => {
        craftItem(name)
        askQuestion() // ask the question again after handling the input
    })
}
askQuestion() // start the loop
