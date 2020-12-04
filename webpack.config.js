var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './client/index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css!'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]

}
