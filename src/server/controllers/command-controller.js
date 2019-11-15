const SessionManager = require('../session-manager');

module.exports = (req, res) => {
   const { sessionId } = req.params
   const { command } = req.body

   const session = SessionManager.getInstance().getSession(sessionId)
   if (!session) {
      res.send(JSON.stringify(
         {
            status: 'BAD',
            response: 'Session not found'
         }
      ))
   }
   else {
      res.send(JSON.stringify(
         {
            status: 'OK',
            response: session.commandRunner.run(command)
         }
      ))
   }
}