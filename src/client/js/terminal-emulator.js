const ProfileManager = require('./profile-manager')
const Context = require('./context')
const Renderer = require('./renderer')
const OutputParser = require('./output-parser')
const util = require('./util')

const CHARACTER_MAP = {
   Enter: '\n',
   Backspace: '\u0008',
   ArrowLeft: '\u001b[D',
   ArrowRight: '\u001b[C',
   ArrowUp: '\u001b[A',
   ArrowDown: '\u001b[B',
   Tab: '\t',
   Escape: '\u001b',
   ControlC: '\x03',
   ControlD: '\x04',
   F12: ''
}

class TerminalEmulator {
   constructor({ termScreenEl, rows, cols, webSocket }) {
      this._termScreenEl = termScreenEl
      this._outputBuffer = ''
      this._renderLoop = null
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
      if (util.BUFFERED_RENDERING) {
         this._ws.addEventListener('message', e => {
            this._outputBuffer = this._outputBuffer + e.data
         })

         this._renderLoop = setInterval(() => {
            this.refreshScreen(this._outputBuffer)
            this._outputBuffer = ''
         }, 25)
      }
      else {
         this._ws.addEventListener('message', e => {
            this.refreshScreen(e.data)
         })
      }
   }

   focus() {
      this._termScreenEl.tabIndex = 100
      this._termScreenEl.focus()

      this._termScreenEl.addEventListener('keydown', e => {
         const ctrl = e.ctrlKey ? e.ctrlKey : (((e.keyCode || e.which) === 17) ? true : false)

         if (ctrl && ['c', 'C', 'd', 'D'].includes(e.key)) {
            this.write(CHARACTER_MAP[`Control${e.key.toUpperCase()}`])
            e.preventDefault()
            e.stopPropagation()
            return
         }

         if (['Tab', 'Control'].includes(e.key)) {
            if (e.preventDefault) {
               e.preventDefault()
            }
         }
         if (['Shift', 'F5', 'Alt', 'AltGraph', 'Control', 'CapsLock', 'Escape'].includes(e.key)) {
            return
         }
         this.write(e.key.length > 1 ? (CHARACTER_MAP[e.key] !== undefined ? { keyboardKey: CHARACTER_MAP[e.key] } : e.key) : e.key)
      })
   }

   refreshScreen(content) {
      this._parser.parse(content)
      this._renderer.render()
   }

   write(data) {
      if (typeof data === 'object') {
         this._ws.send(data.keyboardKey)
      }
      else {
         this._ws.send(data)
      }
   }

}

module.exports = TerminalEmulator