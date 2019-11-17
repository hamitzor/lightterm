const SessionManager = require('../session-manager')

module.exports = (req, res) => {
   const sessionId = SessionManager.getInstance().createSession()
   const commandRunner = SessionManager.getInstance().getSession(sessionId).commandRunner

   res.json(
      {
         status: 'OK',
         response: {
            sessionId: sessionId,
            sessionInfo: {
               user: commandRunner.getUser(),
               hostname: commandRunner.getHostName(),
               home: commandRunner.getHome(),
               cwd: commandRunner.getCWD(),
               isUnix: commandRunner.isUnix
            }
         }
      }
   )
}