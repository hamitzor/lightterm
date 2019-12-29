const express = require('express')

const fileRouter = express.Router()

/* Upload route is bound to corresponding controller */
fileRouter.post('/', require('../controllers/upload-controller'))

module.exports = fileRouter