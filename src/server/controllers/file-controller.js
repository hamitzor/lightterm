const fs = require('fs-extra')
const path = require('path')

exports.upload = (req, res) => {
   req.pipe(req.busboy)
   let uploadDir
   req.busboy.on('field', (name, val) => {
      if (name === 'targetPath') {
         uploadDir = val.trim().replace(/~/g, process.env.HOME)
      }
   })

   req.busboy.on('file', (name, file, fileName) => {
      const filePath = path.resolve(uploadDir, fileName)
      console.log({ filePath })
      const fileStream = fs.createWriteStream(filePath)
      file.pipe(fileStream)
      fileStream.on('close', function () {
         console.log("Uploaded:" + filePath)
      })
   })

   req.busboy.on('finish', () => {
      res.end()
   })
}