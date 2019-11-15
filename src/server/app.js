const express = require('express')
const rootRouter = require('./routers')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(rootRouter)

app.listen(5000, () => console.log('Light Terminal Web API is online at http://localhost:5000'))

module.exports = app