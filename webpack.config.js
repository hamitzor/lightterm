const path = require('path')

const serverConfig = {
   context: path.resolve(__dirname, 'src/server'),
   entry: './index',
   devtool: 'source-map',
   output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'bundle.server.js'
   },
   target: 'node',
   node: {
      __dirname: false
   },
   module: {
      rules: [
         { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
      ]
   },
   stats: {
      warnings: false,
   }
}

const clientConfig = {
   context: path.resolve(__dirname, 'src/client/js'),
   entry: './index',
   devtool: 'source-map',
   output: {
      path: path.resolve(__dirname, 'src/client/public'),
      filename: 'bundle.js'
   },
   target: 'web',
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
         }
      ]
   }
}


module.exports = [serverConfig, clientConfig]