const express = require('express')

const sessionController = require('../controllers/session-controller')
const sessionRouter = express.Router()

sessionRouter.get('/create/:rows/:cols', sessionController.create)
sessionRouter.get('/resize/:sessionId/:rows/:cols', sessionController.resize)

module.exports = sessionRouter