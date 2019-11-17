const { execSync } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')

class CommandRunner {

   constructor({ isUnix, home, cwd, user, hostname }) {
      this.isUnix = isUnix
      this.home = home
      this.cwd = cwd
      this.user = user
      this.hostname = hostname
      /*
         Translator functions for making changes on the outputs of commands
         e.g an ls translator is built-in which adds --color argument to get a fancy output
      */
      this.outputTranslators = { 'ls': [output => output.replace(/\ /gm, '\t')] }
      /*
         Translator functions for making changes on commands before they are executed
         e.g an ls output translator is built-in which removes \r\n between file names on output.
      */
      this.commandTranslators = {
         'ls': [
            command => {
               const args = command.split(' ')
               args.shift()
               return ['ls -C --color', ...args].join(' ')
            }
         ]
      }
   }
   /*
       Additional output translators can be added with this method. 
       'program' is the name of the program in the command that 
       the translator will be applied to its output, e.g 'ls' is the 
       program name in a 'ls -a -D' command.
       'translator' is the translator function which simply
       takes an output and returns a translated output.
   */
   addOutputTranslator(program, translator) {
      if (!this.outputTranslators[program]) {
         this.outputTranslators[program] = [translator]
      }
      else {
         this.outputTranslators[program] = [...this.outputTranslators[program], translator]
      }
   }
   /*
       Additional command translators can be added with this method. 
       'program' is the name of the program in the command that 
       the translator will be applied to, e.g 'ls' is the program name 
       in a 'ls -a -D' command.
       'translator' is the translator function which simply
       takes a command and returns a translated command.
   */
   addCommandTranslator(program, translator) {
      if (!this.commandTranslators[program]) {
         this.commandTranslators[program] = [translator]
      }
      else {
         this.commandTranslators[program] = [...this.commandTranslators[program], translator]
      }
   }
   // Method that applies all output translators by a given command
   translateOutput(command, output) {
      const program = command.split(' ')[0]
      const translators = this.outputTranslators[program]
      let translatedOutput = output
      if (translators) {
         translators.forEach(translator => {
            translatedOutput = translator(translatedOutput)
         })
      }
      return translatedOutput
   }
   // Method that applies all command translators by a given command
   translateCommand(command) {
      const program = command.split(' ')[0]
      const translators = this.commandTranslators[program]
      let translatedCommand = command
      if (translators) {
         translators.forEach(translator => {
            translatedCommand = translator(translatedCommand)
         })
      }
      return translatedCommand
   }
   //Returns cwd according to platform (if linux, adds ~ placeholder for home directory)
   getCWD() {
      let cwd = `${path.resolve(this.cwd)}`
      if (this.isUnix) {
         cwd = cwd.replace(process.env.HOME, '~')
      }
      return cwd
   }

   getHome() {
      return this.home
   }

   getUser() {
      return this.user
   }

   getHostName() {
      return this.hostname
   }

   run(command) {
      try {
         //Obtain program name
         const program = command.split(' ')[0]
         //if it is not cd (change directory command) then do usual routine
         if (program !== 'cd') {
            const translatedCommand = this.translateCommand(command)
            const output = execSync(translatedCommand, { shell: this.isUnix ? '/bin/bash' : undefined, cwd: this.cwd }).toString()
            return this.translateOutput(command, output)
         }
         //if not, do change directory
         else {
            //check for second argument (desired directory)
            const dir = command.split(' ')[1]
            //if it is not present, change it with home so user can cd its home when it types only 'cd'
            const newCWD = path.resolve(this.cwd, dir === undefined ? this.home : dir)
            //see if the directory exists, if not return a fancy message with respect to platform
            if (fs.existsSync(newCWD) && fs.lstatSync(newCWD).isDirectory()) {
               this.cwd = newCWD
            }
            else {
               return this.isUnix ? 'bash: cd: adsfasfd: No such file or directory' : 'The system cannot find the path specified.'
            }
         }
      }
      catch (err) {
         //@TODO: do logging maybe?
         return this.isUnix ? `Command '${command}' not found` : `'${command}' is not recognized as an internal or external command, operable program or batch file.`
      }
   }
}


module.exports = CommandRunner