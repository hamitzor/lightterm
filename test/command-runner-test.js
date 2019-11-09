const CommandRunner = require('../src/command-runner')

const commandRunner = new CommandRunner()


const readline = require('readline')

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
})

const showPromt = () => {
   rl.question(`${commandRunner.getCWD()}${commandRunner.isUnix ? ':$ ' : '>'} `, command => {
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

showPromt()