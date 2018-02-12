const path = require('path');
module.exports = {
  entry: './src/whisk.js',
  output: {
    path: path.resolve('dist'),
    filename: 'whisk.min.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}