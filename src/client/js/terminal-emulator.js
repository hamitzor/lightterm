const util = require('./util')
const ansiiConverter = require('./ansii-converter')
const config = require('./config.json')

class TerminalEmulator {
   constructor({ emulatorId, user, hostname, home, cwd, isUnix, sessionId }) {
      this.command = ""
      this.runningCommand = false
      this.user = user
      this.hostname = hostname
      this.home = home
      this.cwd = cwd
      this.isUnix = isUnix
      this.sessionId = sessionId
      this.root = document.querySelector(`#${emulatorId}`)
      this.commandReaderEl = this.root.querySelector('.command-reader')
      this.commandValueEl = this.commandReaderEl.querySelector('.command-value')
      this.commandValueInputEl = this.commandReaderEl.querySelector('.command-value-input')
      this.cursorEl = this.commandReaderEl.querySelector('.cursor')
      this.promptStringEl = this.commandReaderEl.querySelector('.prompt-string')
      this.logEl = this.root.querySelector('.log')

      setInterval(() => {
         if (this.cursorEl.style.visibility === 'visible') {
            this.cursorEl.style.visibility = 'hidden'
         }
         else {
            this.cursorEl.style.visibility = 'visible'
         }
      }, 400)

      this.commandValueInputEl.addEventListener('keyup', e => {
         if (this.runningCommand) {
            e.preventDefault()
            return
         }
         if (e.keyCode === 13) {
            e.preventDefault()
            this.runningCommand = true
            this.run()
         }
         else {
            this.command = this.commandValueInputEl.value
            this.commandValueEl.innerHTML = this.command.replace(/\ /g, '&nbsp;')
         }
      })

      this.commandReaderEl.onfocus = () => {
         this.commandValueInputEl.focus()
      }

      this.updatePromptString()
   }

   getPromptString() {
      if (this.isUnix) {
         return `\u001b[32m${this.user}@${this.hostname}\u001b[0m:\u001b[34m${this.cwd}\u001b[0m$`
      }
      else {
         return `${this.cwd}> `
      }
   }

   updatePromptString() {
      const els = util.createEl(`<span>${ansiiConverter.toHtml(this.getPromptString())}</span>`)
      this.promptStringEl.innerHTML = ''
      this.promptStringEl.appendChild(els)
   }

   run() {
      fetch(`http://localhost:${config.port}/command/${this.sessionId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ command: this.command })
      })
         .then(res => res.json())
         .then(({ response }) => {
            console.log(response)
            const readerClone = this.commandReaderEl.cloneNode(true)
            const cursor = readerClone.querySelector('.cursor')
            readerClone.removeChild(cursor)
            this.logEl.appendChild(readerClone)
            this.cwd = response.cwd
            this.updatePromptString()
            if (response.output) {
               this.logEl.appendChild(util.createEl(`<div>${ansiiConverter.toHtml(response.output)}</div>`))
            }
            this.runningCommand = false
            this.commandValueInputEl.value = ''
            this.commandValueEl.innerHTML = ''
            this.command = ''
         })
   }

}

module.exports = TerminalEmulator