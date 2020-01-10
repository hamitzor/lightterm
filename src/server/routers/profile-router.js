const express = require('express')
const profileControllers = require('../controllers/profile-controllers')

const profileRouter = express.Router()

/* Profile routes are bound to corresponding controllers */
profileRouter.get('/', profileControllers.get)
profileRouter.post('/', profileControllers.update)

module.exports = profileRouter