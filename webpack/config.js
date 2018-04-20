'use strict'

/* eslint no-var: 0 */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var path = require('path');
var qs = require('qs');
var autoprefixer = require('autoprefixer');

var TEMPLATE = path.join(__dirname, '../src/index.html');
var INDEX_NAME = 'index.html';
var ENTRY_PATH = path.join(__dirname, '../src/client/index.jsx');
var OUTPUT_PATH = path.join(__dirname, '../build');
var PORT = 1337;

module.exports = {
  name: 'client',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: ENTRY_PATH,
    vendor: [
      'react',
      'material-ui',
    ],
  },
  output: {
    path: path.join(__dirname, OUTPUT_PATH),
    publicPath: '/',
    filename: '[name]__[hash].js',
    chunkFilename: '[name]__[chunkhash].chunk.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                import: true,
                importLoaders: 1,
                localIdentName: '[path][name]_[local]--[hash:base64:8]',
                camelCase: true,
                minimize: true,
                sourceMap: true,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: { path: path.join(__dirname, './postcss.config.js') },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000,
            name: 'images/[name].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  devServer: {
    hot: true,
    port: PORT,
    overlay: true,
    progress: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ProgressBarPlugin({ clear: false }),
    new ExtractTextPlugin({
      filename: 'style__[hash].css',
    }),
    new HtmlWebpackPlugin({
      filename: INDEX_NAME,
      template: TEMPLATE,
    }),
    new UglifyJsPlugin(),
  ],
};
