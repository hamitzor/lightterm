const crypto = require("crypto")
const os = require('os')
const CommandRunner = require('../services/command-runner')

class SessionManager {

   constructor() {
      this._sessions = {}
   }

   updateSession(update) {
      this._sessions[sessionId] = { ...this._sessions[sessionId], ...update }
   }

   createSession() {
      const isUnix = os.platform() !== 'win32'
      const home = isUnix ? process.env.HOME : process.env.USERPROFILE
      const user = isUnix ? process.env.USER : process.env.USERNAME
      const hostname = os.hostname()
      const sessionId = crypto.randomBytes(56).toString('hex')
      const commandRunner = new CommandRunner({ isUnix, home, cwd: home, user, hostname })
      this._sessions[sessionId] = { isUnix, home, user, hostname, commandRunner }
      return sessionId
   }

   getSession(sessionId) {
      return this._sessions[sessionId]
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