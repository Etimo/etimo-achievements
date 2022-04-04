const { merge } = require('webpack-merge');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.common.js');

require('dotenv').config();

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({
      path: './.env',
      allowEmptyValues: true,
      defaults: true,
      safe: './.env.defaults',
    }),
  ],
  devServer: {
    hot: true,
    port: process.env.PORT,
    historyApiFallback: true,
  },
});
