const path = require('path')

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


module.exports = [clientConfig]