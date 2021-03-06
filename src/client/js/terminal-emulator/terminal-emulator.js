const Context = require('./context')
const Renderer = require('./renderer')
const OutputParser = require('./output-parser')
const config = require('../../../../config.json')

/* Character map that transforms pressed keys on client-side to actual sequences and characters for the emulator.
Normal characters like a,b,0,1,-,_,? are not mapped here because they are directly sent to the emulator. 
Only 12 special keys are handled in emulator in the context of this project. */
const APPLICATION_KEYPAD_MAPPING = {
   Space: '\u001bO\x20',
   '*': '\u001bOj',
   '+': '\u001bOk',
   ',': '\u001bOl',
   '-': '\u001bOm',
   Delete: '\u001b[3~',
   '/': '\u001bOo',
   Insert: '\u001b[2~',
   End: '\u001bOF',
   ArrowDown: '\u001b[B',
   PageDown: '\u001b[6~',
   ArrowLeft: '\u001b[D',
   Begin: '\u001b[E',
   ArrowRight: '\u001b[C',
   Home: '\u001b[H',
   ArrowUp: '\u001b[A',
   PageUp: '\u001b[5~',
   '=': '\u001bOX',
}
const APPLICATION_CURSOR_KEYS_MAPPING = {
   ArrowLeft: '\u001bOD',
   ArrowRight: '\u001bOC',
   ArrowUp: '\u001bOA',
   ArrowDown: '\u001bOB',
   Home: '\u001bOH',
   End: '\u001bOF',
}
const ALL_CHARACTERS = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
const KEY_MAPPING = {
   Enter: '\x0D',
   Backspace: '\x08',
   ArrowLeft: '\u001b[D',
   ArrowRight: '\u001b[C',
   ArrowUp: '\u001b[A',
   ArrowDown: '\u001b[B',
   Tab: '\x09',
   Escape: '\u001b',
   Delete: '\u001b[3~',
   F12: '',
   Home: '\u001b[H',
   End: '\u001b[F',
   PageUp: '\u001b[5~',
   PageDown: '\u001b[6~',
   'Control@': '\x00',
   ControlA: '\x01',
   ControlB: '\x02',
   ControlC: '\x03',
   ControlD: '\x04',
   ControlE: '\x05',
   ControlF: '\x06',
   ControlG: '\x07',
   ControlH: '\x08',
   ControlI: '\x09',
   ControlJ: '\x0A',
   ControlK: '\x0B',
   ControlL: '\x0C',
   ControlM: '\x0D',
   ControlN: '\x0E',
   ControlO: '\x0F',
   ControlP: '\x10',
   ControlQ: '\x11',
   ControlR: '\x12',
   ControlS: '\x13',
   ControlT: '\x14',
   ControlU: '\x15',
   ControlV: '\x16',
   //Some browsers close tab when user perform a ctrl+w, so it is replaced with ctrt+2
   'Control2': '\x17',
   ControlX: '\x18',
   ControlY: '\x19',
   ControlZ: '\x1A',
   'Control[': '\x1B',
   'Control\\': '\x1C',
   'Control]': '\x1D',
   'Control^': '\x1E',
   'Control_': '\x1F',
}

/* Class that emulates a terminal on client-side */
class TerminalEmulator {
   /* It needs a profile manager instance, a valid HTML element to be used as root element for rendering, row number
   and column number, a valid WebSocket instance, a handler for play bell sound command and a handler for update
   window title command. */
   constructor({ profileManager, termScreenEl, onBell, onTitleUpdate }) {
      this._errorOccured = false
      this._termScreenEl = termScreenEl
      this._outputBuffer = ''
      this._profileManager = profileManager
      this._title = '~'
      this._lastWrittenData = undefined

      /* Create a context for the emulator */
      this._context = new Context({
         rows: this._profileManager.getRowNumber(),
         cols: this._profileManager.getColNumber(),
         onError: (err, message) => {
            console.error(err, message)
            this._errorOccured = true
         }
      })

      /* Set handlers on context */
      this._context.onWindowCommand(command => {
         if (command[0] === 'bell') {
            onBell()
         }
         else if (command[0] === 'update-title') {
            onTitleUpdate(command[1], this)
            this._title = command[1]
         }
      })

      /* Add 'drop file' event listener */
      this._termScreenEl.addEventListener('drop', e => {
         e.preventDefault()
         const files = e.dataTransfer.files
         this.uploadFile(files)
      })

      /* A fix to prevent browser from opening the dragged file */
      this._termScreenEl.addEventListener('dragover', e => {
         e.preventDefault()
      })

      /* Create a Renderer instance for emulator */
      this._renderer = new Renderer({ profileManager: this._profileManager, termScreenEl, context: this._context })
      this._renderer.createScreen()
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

   /* Upload a file to the remote machine using HTTP. This is called when user drops a file into the tab screen. 
   Show information alert after upload. */
   async uploadFile(files) {
      const formData = new FormData()
      /* Title is used to decide where to upload the file */
      formData.append('targetPath', new RegExp(/.*@.*:(.*)/g).exec(this._title)[1])
      for (let i = 0; i < files.length; i++) {
         formData.append('file' + i, files[i])
      }
      await fetch(`http://${config.hostname}:${config.port}/file`, {
         method: 'POST',
         body: formData
      })

      const alertEl = document.getElementById('alert')
      alertEl.innerHTML = 'Uploaded files successfully!'
      alertEl.classList.add('show')
      setTimeout(() => {
         alertEl.classList.remove('show')
      }, 2000)
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
      this._ws.addEventListener('message', e => {
         this.refreshScreen(e.data)
      })
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
            if (ctrl && (e.key === '2' || ALL_CHARACTERS.split('').includes(e.key))) {
               this.write(KEY_MAPPING[`Control${e.key.toUpperCase()}`])
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
                  let keyMap = KEY_MAPPING
                  let cursorKeyMap = KEY_MAPPING
                  if (this._context.isApplicationCursors()) {
                     cursorKeyMap = APPLICATION_CURSOR_KEYS_MAPPING
                  }
                  if (this._context.isApplicationKeypad()) {
                     keyMap = { ...keyMap, ...APPLICATION_KEYPAD_MAPPING }
                  }
                  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
                     this.write(cursorKeyMap[e.key])
                  }
                  else {
                     this.write(e.key.length > 1 ? (keyMap[e.key] !== undefined ? keyMap[e.key] : e.key) : e.key)
                  }
               }
            }
         }
      })
   }

   recreateScreen() {
      this._renderer.createScreen()
      this._renderer.render()
   }

   /* Render a frame. First, parse the content (a terminal output), then call render method of renderer  */
   refreshScreen(content) {
      this._parser.parse(content)
      this._renderer.render()
   }

   /* Use WebSocket connection to send message to Web API. */
   write(data) {
      if (this._lastWrittenData === data) {
         return
      }
      this._lastWrittenData = data
      this._ws.send(data)
      setTimeout(() => {
         this._lastWrittenData = undefined
      }, 10)
   }

}

module.exports = TerminalEmulator