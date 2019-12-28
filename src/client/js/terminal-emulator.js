const ProfileManager = require('./profile-manager')
const Context = require('./context')
const Renderer = require('./renderer')
const OutputParser = require('./output-parser')

const CHARACTER_MAP = {
   Enter: '\n',
   Backspace: '\u0008',
   ArrowLeft: '\u001b[D',
   ArrowRight: '\u001b[C'
}

class TerminalEmulator {
   constructor({ termScreenEl, rows, cols, webSocket }) {
      this._termScreenEl = termScreenEl
      this._profileManager = new ProfileManager()
      this._context = new Context({ cols, rows })
      this._renderer = new Renderer({ profileManager: this._profileManager, termScreenEl, context: this._context })
      this._parser = new OutputParser({ context: this._context })
      this._profileManager.updateStyleSheet()
      this._url = ''
      this._ws = webSocket
   }

   getProfileManager() {
      return this._profileManager
   }

   connect() {
      this._ws.addEventListener('message', e => {
         this.refreshScreen(e.data)
      })
      this._termScreenEl.tabIndex = 100
      this._termScreenEl.focus()
      this._termScreenEl.addEventListener('keyup', e => {
         this.write(e.key.length > 1 ? (CHARACTER_MAP[e.key] ? CHARACTER_MAP[e.key] : e.key) : e.key)
      })
   }

   refreshScreen(content) {
      if (content === '\u0007') {
         new Audio('/public/bell.mp3').play()
      }
      else {
         this._parser.parse(content)
         this._renderer.render()
      }
   }

   write(data) {
      this._ws.send(data)
   }

}

module.exports = TerminalEmulator