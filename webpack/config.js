'use strict'

/* eslint no-var: 0 */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var qs = require('qs');
var autoprefixer = require('autoprefixer');

var TEMPLATE = path.resolve(__dirname, '../src/index.html');
var INDEX_NAME = 'index.html';
var ENTRY_PATH = path.resolve(__dirname, '../src/client/index.jsx');
var OUTPUT_PATH = path.resolve(__dirname, '../build');
var PORT = 1337;

module.exports = {
  name: 'client',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: ENTRY_PATH,
    vendor: ['react'],
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '/',
    filename: '[name]__[hash].js',
    chunkFilename: '[name]__[chunkhash].chunk.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
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
                localIdentName: '[name]_[local]--[hash:base64:8]',
                camelCase: true,
                minimize: true,
                sourceMap: true,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: { path: path.resolve(__dirname, './postcss.config.js') },
                sourceMap: true,
                publicPath: '../build',
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
            name: '[path][name].[hash].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '../src/client/components'),
      '@containers': path.resolve(__dirname, '../src/client/containers'),
      '@entities': path.resolve(__dirname, '../src/client/engines/entities'),
      '@dux': path.resolve(__dirname, '../src/client/dux'),
      '@images': path.resolve(__dirname, '../src/client/assets/images'),
      '@utils': path.resolve(__dirname, '../src/client/utils'),
      '@engines': path.resolve(__dirname, '../src/client/engines'),
      '@devtools': path.resolve(__dirname, '../src/devtools'),
    },
    extensions: ['.js', '.jsx', '.scss'],
  },
  devServer: {
    hot: true,
    port: PORT,
    overlay: true,
    progress: true,
    historyApiFallback: true,
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
  ],
};
