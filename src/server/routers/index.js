const express = require('express')

const rootRouter = express.Router()

/* All routes are reduced into one router */
rootRouter.use('/', require('./home-router'))
rootRouter.use('/session', require('./session-router'))
rootRouter.use('/file', require('./file-router'))

module.exports = rootRouter