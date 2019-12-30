/* Webpack configuration file. Webpack is used for bundling all client-side application into one
file, called bundle.js, to include it in index.html file. Babel loader extension is also added here. */ 
const path = require('path')

const clientConfig = {
   context: path.resolve(__dirname, 'src/client/js'),
   entry: './app.js',
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