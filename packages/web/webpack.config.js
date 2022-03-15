const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

require('dotenv').config();

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  target: 'web',
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './assets', to: './assets' }],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      assetPath: '/assets',
    }),
  ],
  devServer: {
    hot: true,
    port: process.env.PORT,
  },
};
