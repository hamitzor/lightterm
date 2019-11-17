const TerminalEmulator = require('./terminal-emulator')
const config = require('./config.json')

module.exports = async () => {
   const response = await fetch(`http://localhost:${config.port}/create-session`)
   const { sessionId, sessionInfo } = (await response.json()).response

   const options = {
      emulatorId: 'emulator1',
      user: sessionInfo.user,
      hostname: sessionInfo.hostname,
      home: sessionInfo.home,
      cwd: sessionInfo.cwd,
      isUnix: sessionInfo.isUnix,
      sessionId
   }

   const terminal = new TerminalEmulator(options)

   document.addEventListener('click', () => terminal.commandReaderEl.focus())
   console.log(terminal.commandReaderEl.focus())
}