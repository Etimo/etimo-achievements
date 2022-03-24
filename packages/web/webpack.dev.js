const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

require('dotenv').config();

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin(), new Dotenv()],
  devServer: {
    hot: true,
    port: process.env.PORT,
    historyApiFallback: true,
  },
});
