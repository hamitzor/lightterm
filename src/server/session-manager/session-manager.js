const crypto = require("crypto")
const pty = require('node-pty')

/* Class that is responsible for managing sessions. A session is composed of three 
components, which are 'screen size', 'output logs' and 'emulator process'. */
class SessionManager {

   constructor() {
      this._sessions = {}
   }

   /* Update screen size */
   resize({ sessionId, cols, rows }) {
      const session = this._sessions[sessionId]
      /* Update session data */
      this._sessions[sessionId] = { ...session, cols, rows }
      /* Send 'resize' signal to the actual emulator process */
      session.emulator.resize(parseInt(cols), parseInt(rows))
      console.log('Resized: ', { sessionId, cols, rows })
   }

   /* Create a new session */
   createSession({ cols, rows }) {
      /* Generate an id for the session */
      const sessionId = crypto.randomBytes(2).toString('hex')
      const logs = ''

      /* Spawn the emulator process with the help of 'node-pty'. */
      const emulator = pty.spawn('bash', [], {
         name: 'xterm-color',
         cols: parseInt(cols),
         rows: parseInt(rows),
         cwd: process.env.HOME,
         encoding: 'utf8'
      })

      /* Save session data */
      this._sessions[sessionId] = { cols, rows, logs, emulator }

      /* Start saving the output immediately, since the emulator won't be waiting for
      the client (slave) to connect to produce output. */
      emulator.on('data', data => {
         if (this._sessions[sessionId]) {
            this._sessions[sessionId].logs += data
         }
      })
      console.log('Session created: ', { sessionId, cols, rows })
      return sessionId
   }

   getSession(sessionId) {
      return this._sessions[sessionId]
   }

   deleteSession(sessionId) {
      delete this._sessions[sessionId]
   }
}

/* Return an instance of the class instead of the class itself, because only one
instance should exist of this class. (Singleton) */
module.exports = new SessionManager()