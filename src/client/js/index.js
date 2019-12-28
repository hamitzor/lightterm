require('core-js/stable')
require('regenerator-runtime/runtime')
const TerminalEmulator = require('./terminal-emulator')


const init = async function () {

   const rows = 35
   const cols = 130
   const termScreenEl = document.getElementById('term-tab')

   const res = await fetch('http://localhost:5000/session/create/' + rows + '/' + cols)
   const { response: { sessionId } } = await res.json()

   const url = 'ws://localhost:5000/session/connect/' + sessionId

   const ws = new WebSocket(url)

   ws.addEventListener('open', function (event) {
      const emulator = new TerminalEmulator({
         termScreenEl, rows, cols, webSocket: ws
      })
      const pm = emulator.getProfileManager()
      pm.updateText({ fontSize: 18 })
      pm.updateStyleSheet()
      emulator.connect()
      emulator.focus()
   })
}

init()