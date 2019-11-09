const CommandRunner = require('../src/command-runner')

const commandRunner = new CommandRunner()


const readline = require('readline')

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
})

const showPromt = () => {
   const promt = `${commandRunner.getUser()}@${commandRunner.getHostName()}:${commandRunner.getCWD()}${commandRunner.isUnix ? '$' : '>'} `
   rl.question(promt, command => {
      if (command === 'exit') {
         rl.close()
         return
      }
      const output = commandRunner.run(command)
      if (output) {
         console.log(output)
      }
      showPromt()
   })
}

console.log('Welcome to command-runner test! This is a terminal emulator tests CommandRunner class')
console.log(`isUnix: ${commandRunner.isUnix.toString()}`)
console.log(`home: ${commandRunner.getHome()}`)
console.log(`user: ${commandRunner.getUser()}`)
console.log(`host: ${commandRunner.getHostName()}\n`)
showPromt()