const webpack = require('webpack');
const rules = require('./webpack.rules');
const path = require('path')


module.exports = {
  entry: './src/main.js',

  module: {
    rules,
  },
  plugins: [
    new webpack.DefinePlugin({
      __static: JSON.stringify('static/')
    })
  ]
};
