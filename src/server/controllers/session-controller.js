const SessionManager = require('../session-manager')

exports.create = (req, res) => {
   res.json(
      {
         status: 'OK',
         response: {
            sessionId: SessionManager.getInstance().createSession({ cols: req.params.cols, rows: req.params.rows })
         }
      }
   )
}

exports.resize = (req, res) => {
   SessionManager.getInstance().resize({ sessionId: req.params.sessionId, cols: req.params.cols, rows: req.params.rows })
   res.json(
      {
         status: 'OK',
         response: {
         }
      }
   )
}

exports.connect = (ws, req) => {
   const sessionId = req.params.sessionId
   const session = SessionManager.getInstance().getSession(sessionId)

   ws.send(session.logs)

   let buffer = []
   let timeout = null

   session.emulator.on('data', function (data) {
      buffer.push(data)
      if (!timeout) {
         timeout = setTimeout(() => {
            try {
               ws.send(buffer.join(''))
               buffer = []
               timeout = null
            } catch (e) {
               console.log('Connection is already closed')
            }
         }, 25)
      }
   })

   ws.on('message', function (msg) {
      session.emulator.write(msg)
   })

   ws.on('close', function () {
      session.emulator.kill()
      SessionManager.getInstance().deleteSession(sessionId)
      console.log('Closed terminal ' + sessionId)
   })
}