const express = require('express')

const fileRouter = express.Router()
const fileController = require('../controllers/file-controller')

fileRouter.post('/', fileController.upload)

module.exports = fileRouter