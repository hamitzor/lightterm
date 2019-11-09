const { execSync } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')

class CommandRunner {

   constructor() {
      this.cwd = process.env.HOME
      this.user = process.env.USER
      this.hostname = process.env.HOSTNAME
   }

   getCWD() {
      return `\x1b[1m\x1b[34m${path.resolve(this.cwd).replace(process.env.HOME, '~')}\x1b[0m`
   }

   getUser() {
      return this.user
   }

   getHostName() {
      return this.hostname
   }

   isUnix() {
      return os.platform() !== 'win32'
   }

   run(command) {
      try {
         const program = command.split(' ')[0]
         if (program !== 'cd') {
            return CommandRunner.translateOutput(command,
               execSync(CommandRunner.translateCommand(command),
                  { shell: '/bin/bash', cwd: this.cwd }).toString())
         }
         else {
            const dir = command.split(' ')[1]
            const newCWD = path.resolve(this.cwd, dir === undefined ? process.env.HOME : dir)
            if (fs.existsSync(newCWD) && fs.lstatSync(newCWD).isDirectory()) {
               this.cwd = newCWD
            }
            else {
               return 'bash: cd: adsfasfd: No such file or directory'
            }
         }
      }
      catch (err) {
         return ''
      }
   }
}

CommandRunner.translateOutput = (command, output) => {
   const program = command.split(' ')[0]
   switch (program) {
      case 'ls':
         return output.replace(/(\r\n|\n|\r)/gm, '  ')
      default:
         return output
   }
}

CommandRunner.translateCommand = command => {
   const args = command.split(' ')
   const program = args[0]
   args.shift()
   switch (program) {
      case 'ls':
         return ['ls --color', ...args].join(' ')
      default:
         return [program, ...args].join(' ')
   }
}


module.exports = CommandRunner