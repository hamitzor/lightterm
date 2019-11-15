const express = require('express')

const commandRouter = express.Router()

commandRouter.post('/:sessionId', require('../controllers/command-controller'))

module.exports = commandRouter