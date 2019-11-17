const SessionManager = require('../session-manager');

module.exports = (req, res) => {
   const { sessionId } = req.params
   const { command } = req.body

   const session = SessionManager.getInstance().getSession(sessionId)
   if (!session) {
      res.json(
         {
            status: 'BAD',
            response: 'Session not found'
         }
      )
   }
   else {
      res.json(
         {
            status: 'OK',
            response: {
               output: session.commandRunner.run(command),
               cwd: session.commandRunner.getCWD()
            }
         }
      )
   }
}