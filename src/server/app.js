/* Server-side application */
const express = require('express')
const rootRouter = require('./routers')
const path = require('path')
const config = require('../../config.json')
const expressWs = require('express-ws')
const sessionControllers = require('./controllers/session-controllers')
const busboy = require('connect-busboy')
const bodyParser = require('body-parser')

/* Express server initialized here */
const initializeApp = () => {
   const app = express()

   /* Use express-ws for WebSocket connections */
   expressWs(app)

   /* Set the directory for static files, *.css, *.js, etc.*/
   app.use(express.static(path.resolve(__dirname, '../client/public')))
   app.use(bodyParser.json())
   /* Use busboy middleware for file uploading */
   app.use(busboy())
   /* Bind root router that includes all sub-routers */
   app.use(rootRouter)

   /* Bind websocket controller, responsible for creating persistent connection */
   app.ws('/session/connect/:sessionId', sessionControllers.connect)

   /* Start listening on the specified port in config.json file */
   app.listen(config.port, () => console.log(`lightterm Web API is online at http://${config.hostname}:${config.port}`))
}

/* Start server-side application */
initializeApp()