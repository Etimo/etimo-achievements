const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/app/index.tsx'),
  target: 'web',
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './assets', to: './assets' }],
    }),
    new HtmlPlugin({
      template: path.join(__dirname, 'src', 'app', 'index.html'),
      assetPath: '/assets',
    }),
  ],
};
