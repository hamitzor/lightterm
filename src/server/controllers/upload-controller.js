const fs = require('fs-extra')
const path = require('path')

/* Files are uploaded according to post field 'targetPath', which is determined
and sent by client side application */
module.exports = (req, res) => {
   req.pipe(req.busboy)
   let uploadDir
   req.busboy.on('field', (name, val) => {
      if (name === 'targetPath') {
         /* If the path includes tilde character (~), replace with home directory */
         uploadDir = val.trim().replace(/~/g, process.env.HOME)
      }
   })

   /* Create a write stream and save the file to filesystem */
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