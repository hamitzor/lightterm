const express = require('express')

const createSessionRouter = express.Router()

createSessionRouter.get('/', require('../controllers/create-session-controller'))

module.exports = createSessionRouter