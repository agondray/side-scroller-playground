'use strict'

/* eslint no-var: 0 */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
  devtool: 'eval-source-map',
  entry: {
    main: ENTRY_PATH,
    vendor: ['react'],
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '/',
    filename: '[name]__[fullhash].js',
    //chunkFilename: '[name]__[chunkhash].chunk.js',
    clean: true,
  },
  module: {
    rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					//options: {
					//	presets: [
					//		'@babel-preset-env',
					//	],
					//	plugins: [
					//		'@babel/plugin-transform-object-rest-spread',
					//	],
					//},
				},	
			},
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
					"style-loader",
	  			"css-loader",
	  			"sass-loader",
				], 
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[path][name].[fullhash].[ext]',
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
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  devServer: {
    hot: true,
    port: PORT,
    progress: true,
    client: {
      overlay: true,   
    },
    historyApiFallback: true,
  },
  optimization: {
    moduleIds: 'named',
    emitOnErrors: true,
    //splitChunks: {
    //  chunks: 'async',
    //  minSize: 20000,
    //  minChunks: 1,
    //  maxAsyncRequests: 30,
    //  maxInitialRequests: 5,
    //  cacheGroups: {
    //    vendors: {
    //      test: /[\\/]node_modules[\\/]/,
    //      priority: -10,
    //    },
    //    default: {
    //      minChunks: 2,
    //      priority: -20,
    //      reuseExistingChunk: true,
    //    },
    //  },
    //},
  },
  plugins: [
    new ProgressBarPlugin({ clear: false }),
    new MiniCssExtractPlugin({
      filename: 'style__[fullhash].css',
    }),
    new HtmlWebpackPlugin({
      filename: INDEX_NAME,
      template: TEMPLATE,
    }),
  ],
};
