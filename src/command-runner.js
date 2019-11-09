const { execSync } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')

class CommandRunner {

   constructor() {
      this.isUnix = os.platform() !== 'win32'
      this.home = this.isUnix ? process.env.HOME : process.env.USERPROFILE
      this.cwd = this.home
      this.user = this.isUnix ? process.env.USER : process.env.USERNAME
      this.hostname = this.isUnix ? process.env.HOSTNAME : process.env.USERDOMAIN
   }

   getCWD() {
      const cwd = `${this.isUnix ? '\x1b[1m\x1b[34m' : ''}${path.resolve(this.cwd)}`
      if (this.isUnix) {
         cwd.replace(process.env.HOME, '~')
      }
      return `${cwd}\x1b[0m`
   }

   getUser() {
      return this.user
   }

   getHostName() {
      return this.hostname
   }

   run(command) {
      try {
         const program = command.split(' ')[0]
         if (program !== 'cd') {
            return CommandRunner.translateOutput(command,
               execSync(CommandRunner.translateCommand(command),
                  { shell: this.isUnix ? '/bin/bash' : undefined, cwd: this.cwd }).toString())
         }
         else {
            const dir = command.split(' ')[1]
            const newCWD = path.resolve(this.cwd, dir === undefined ? this.home : dir)
            if (fs.existsSync(newCWD) && fs.lstatSync(newCWD).isDirectory()) {
               this.cwd = newCWD
            }
            else {
               return this.isUnix ? 'bash: cd: adsfasfd: No such file or directory' : 'The system cannot find the path specified.'
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