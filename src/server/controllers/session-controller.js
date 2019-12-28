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

   function bufferUtf8(socket, timeout) {
      let buffer = []
      let sender = null
      let length = 0
      return (data) => {
         buffer.push(data)
         length += data.length
         if (!sender) {
            sender = setTimeout(() => {
               socket.send(buffer.join(''))
               buffer = []
               sender = null
               length = 0
            }, timeout)
         }
      }
   }

   const send = bufferUtf8(ws, 20)

   session.emulator.on('data', function (data) {
      try {
         send(data)
      } catch (ex) {
         // The WebSocket is not open, ignore
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