const app = require('./app');
const config = require('../../config.json')

/* Start listening on the specified port in config.json file */
app.listen(config.port, () => console.log(`lightterm Web API is online at http://${config.hostname}:${config.port}`))