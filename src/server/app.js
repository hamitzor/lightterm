const express = require('express')
const rootRouter = require('./routers')
const bodyParser = require('body-parser')
const path = require('path')
const config = require('../../config.json')

const app = express()

app.use(express.static(path.resolve(__dirname, '../src/client')))
app.use(bodyParser.json())
app.use(rootRouter)

app.listen(config.port, () => console.log('Light Terminal Web API is online at http://localhost:' + config.port))

module.exports = app