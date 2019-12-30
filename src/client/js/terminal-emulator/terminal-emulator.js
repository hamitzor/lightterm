const Context = require('./context')
const Renderer = require('./renderer')
const OutputParser = require('./output-parser')
const util = require('../util')
const config = require('../../../../config.json')

/* Character map that transforms pressed keys on client-side to actual sequences and characters for the emulator.
Normal characters like a,b,0,1,-,_,? are not mapped here because they are directly sent to the emulator. 
Only 12 special keys are handled in emulator in the context of this project. */
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
   Delete: '\u001b[3~',
   F12: ''
}

/* Class that emulates a terminal on client-side */
class TerminalEmulator {
   /* It needs a profile manager instance, a valid HTML element to be used as root element for rendering, row number
   and column number, a valid WebSocket instance, a handler for play bell sound command and a handler for update
   window title command. */
   constructor({ profileManager, termScreenEl, onBell, onTitleUpdate }) {
      this._termScreenEl = termScreenEl
      this._outputBuffer = ''
      this._profileManager = profileManager

      /* Create a context for the emulator */
      this._context = new Context({ rows: this._profileManager.getRowNumber(), cols: this._profileManager.getColNumber() })

      /* Set handlers on context */
      this._context.onWindowCommand(command => {
         if (command[0] === 'bell') {
            onBell()
         }
         else if (command[0] === 'update-title') {
            onTitleUpdate(command[1], this)
         }
      })
      /* Create a Renderer instance for emulator */
      this._renderer = new Renderer({ profileManager: this._profileManager, termScreenEl, context: this._context })
      /* Create a OutputParser instance for emulator */
      this._parser = new OutputParser({ context: this._context })

   }

   /* Resize emulator. It happens in two steps: First, update context, next inform actual emulator in Web API */
   async resize() {
      const newRow = this._profileManager.getRowNumber()
      const newCol = this._profileManager.getColNumber()
      this._context.resize(newRow, newCol)
      await fetch(`http://${config.hostname}:${config.port}/session/resize/${this._sessionId}/${newRow}/${newCol}`)
   }

   /* Return session id */
   getSessionId() {
      return this._sessionId
   }

   /* Create a session using Web API */
   async createSession() {
      const res = await fetch(`http://${config.hostname}:${config.port}/session/create/${this._profileManager.getRowNumber()}/${this._profileManager.getColNumber()}`)
      const { response: { sessionId } } = await res.json()
      this._sessionId = sessionId
      this._ws = new WebSocket(`ws://${config.hostname}:${config.port}/session/connect/${this._sessionId}`)
      this._ws.addEventListener('open', () => {
         this.connect()
         this.focus()
      })
   }

   /* Return emulator context */
   getContext() {
      return this._context
   }

   /* Return root element used for rendering */
   getEl() {
      return this._termScreenEl
   }

   /* Return profile manager instance */
   getProfileManager() {
      return this._profileManager
   }

   /* Connect to Web API */
   connect() {
      /* If buffered rendering is activated, store all incoming terminal output in a buffer and in every 6 miliseconds
      use the data in buffer and free it. */
      if (util.BUFFERED_RENDERING) {
         this._ws.addEventListener('message', e => {
            this._outputBuffer = this._outputBuffer + e.data
         })

         setInterval(() => {
            if (this._outputBuffer !== '') {
               this.refreshScreen(this._outputBuffer)
            }
            this._outputBuffer = ''
         }, 6)
      }
      /* If buffered rendering is deactivated, directly use incoming terminal output */
      else {
         this._ws.addEventListener('message', e => {
            this.refreshScreen(e.data)
         })
      }
   }

   /* Attach all event listeners for emulator screen. All keyboard input managed here. */
   focus() {
      /* Focus root element */
      this._termScreenEl.tabIndex = 100
      this._termScreenEl.focus()


      this._termScreenEl.addEventListener('keydown', e => {
         const ctrl = e.ctrlKey ? e.ctrlKey : (((e.keyCode || e.which) === 17) ? true : false)

         /* If user performed crtl+v, copy the clipboard into terminal screen */
         if (ctrl && ['v', 'V'].includes(e.key)) {
            navigator.clipboard.readText()
               .then(content => {
                  this.write(content)
               })
               .catch(err => {
                  console.error('Cannot paste clipboard content', err)
               })
            e.preventDefault()
            e.stopPropagation()
         }
         else {
            if (ctrl && ['c', 'C', 'd', 'D'].includes(e.key)) {
               this.write(CHARACTER_MAP[`Control${e.key.toUpperCase()}`])
               e.preventDefault()
               e.stopPropagation()
            }
            else {
               if (['Tab', 'Control'].includes(e.key)) {
                  if (e.preventDefault) {
                     e.preventDefault()
                  }
               }
               if (!['Shift', 'F5', 'Alt', 'AltGraph', 'Control', 'CapsLock', 'Escape'].includes(e.key)) {
                  /* Transform pressed keys properly and write to emulator standart input */
                  this.write(e.key.length > 1 ? (CHARACTER_MAP[e.key] !== undefined ? { keyboardKey: CHARACTER_MAP[e.key] } : e.key) : e.key)
               }
            }
         }
      })
   }

   /* Render a frame. First, parse the content (a terminal output), then call render method of renderer  */
   refreshScreen(content) {
      this._parser.parse(content)
      this._renderer.render()
   }

   /* Use WebSocket connection to send message to Web API. */
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