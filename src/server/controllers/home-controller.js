const path = require('path')

/* Send index.html file to the client */
module.exports = (req, res) => {
   res.sendFile(path.resolve(__dirname, '../src/client/index.html'))
}