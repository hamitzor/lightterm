const express = require('express')

const homeRouter = express.Router()

/* Home route is bound to corresponding controller */
homeRouter.get('/', require('../controllers/home-controller'))

module.exports = homeRouter