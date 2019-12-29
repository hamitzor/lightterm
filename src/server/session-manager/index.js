const crypto = require("crypto")
const pty = require('node-pty')

class SessionManager {

   constructor() {
      this._sessions = {}
   }

   resize({ sessionId, cols, rows }) {
      const session = this._sessions[sessionId]
      this._sessions[sessionId] = { ...session, cols, rows }
      session.emulator.resize(parseInt(cols), parseInt(rows))
      console.log('Resized: ', { sessionId, cols, rows })
   }

   createSession({ cols, rows }) {
      const sessionId = crypto.randomBytes(56).toString('hex')
      const logs = ''
      const emulator = pty.spawn('bash', [], {
         name: 'xterm-256color',
         cols: parseInt(cols),
         rows: parseInt(rows),
         cwd: process.env.HOME + '/projects',
         encoding: 'utf8'
      })
      this._sessions[sessionId] = { cols, rows, logs, emulator }
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

SessionManager.getInstance = function () {
   if (!SessionManager._instance) {
      SessionManager._instance = new SessionManager()
   }
   return SessionManager._instance
}

SessionManager._instance = null

module.exports = SessionManager