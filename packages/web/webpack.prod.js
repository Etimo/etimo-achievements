const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
  plugins: [
    // The Docker entrypoint will replace these values with the environment variables
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify('___API_URL___'),
    }),
  ],
});
