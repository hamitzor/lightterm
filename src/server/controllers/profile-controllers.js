const path = require('path')
const fs = require('fs')

const PROFILE_FILE = path.resolve(__dirname, '../../../profiles.json')
const DEFAULT_PROFILE_FILE = path.resolve(__dirname, '../../../profiles-default.json')

exports.get = (req, res) => {
   if (!fs.existsSync(PROFILE_FILE)) {
      fs.copyFileSync(DEFAULT_PROFILE_FILE, PROFILE_FILE)
   }
   res.send(fs.readFileSync(PROFILE_FILE).toString())
}

exports.update = (req, res) => {
   fs.writeFileSync(PROFILE_FILE, JSON.stringify(req.body, null, 4))
   res.send(JSON.stringify({status:'OK'}))
}