const express = require('express')
const sessionControllers = require('../controllers/session-controllers')

const sessionRouter = express.Router()

/* Session routes are bound to corresponding controllers */
sessionRouter.get('/create/:rows/:cols', sessionControllers.create)
sessionRouter.get('/resize/:sessionId/:rows/:cols', sessionControllers.resize)

module.exports = sessionRouter