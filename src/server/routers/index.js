const express = require('express')

const rootRouter = express.Router()

rootRouter.use('/', require('./home-router'))
rootRouter.use('/create-session', require('./create-session-router'))
rootRouter.use('/command', require('./command-router'))

module.exports = rootRouter