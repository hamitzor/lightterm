const express = require('express')
const rootRouter = require('./routers')
const bodyParser = require('body-parser')
const path = require('path')
const config = require('../../config.json')
const expressWs = require('express-ws')
const sessionController = require('./controllers/session-controller')

const app = express()
expressWs(app)

app.use(express.static(path.resolve(__dirname, '../client')))
app.use(bodyParser.json())
app.use(rootRouter)
app.ws('/session/connect/:sessionId', sessionController.connect)

app.listen(config.port, () => console.log('Light Terminal Web API is online at http://localhost:' + config.port))

module.exports = app