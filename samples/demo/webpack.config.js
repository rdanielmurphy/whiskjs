const path = require('path');
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
	test: /\.wk$/,
        use: [ '../../compiler.js']
      },
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ],
    loaders: [
      { test: /\.wk$/, loader: '../../compiler.js', exclude: /node_modules/ },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
     ]
  }
}
