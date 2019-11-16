const express = require('express')

const homeRouter = express.Router()

homeRouter.get('/', require('../controllers/home-controller'))

module.exports = homeRouter