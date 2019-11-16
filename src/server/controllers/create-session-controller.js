const SessionManager = require('../session-manager')

module.exports = (req, res) => {
   res.send(JSON.stringify(
      {
         status: 'OK',
         response: SessionManager.getInstance().createSession()
      }
   ))
}