/*
  FOR PRODUCTION
*/
const path = require('path')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const extractSass = new ExtractTextPlugin({
  filename: '/css/main.[contenthash:8].css',
  disable: false,
  allChunks: true
})
console.log(process.env.NODE_ENV)
process.traceDeprecation = true

module.exports = {
  devtool: '#cheap-module-source-map',
  entry: {
    app: ['babel-polyfill', 'whatwg-fetch', './src/index.js'],
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'react-router-dom'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '/js/[name].[chunkhash:8].js',
    chunkFilename: '/js/[name].[chunkhash:8].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      modules: path.resolve(__dirname, 'src/modules'),
      static: path.resolve(__dirname, 'src/static'),
      store: path.resolve(__dirname, 'src/store'),
      tools: path.resolve(__dirname, 'src/tools'),
      api: path.resolve(__dirname, 'src/api')
    }
  },
  plugins: [
    extractSass,
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(['build']),
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      template: 'index.template.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0'],
              babelrc: false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                module: true,
                importLoaders: 1,
                sourceMap: true,
                localIdentName: '[name]_[local]_[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [path.resolve(__dirname, 'src/modules/shared')]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192&name=/images/[hash:8].[name].[ext]'
      },
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{ loader: 'file-loader' }]
      }
    ]
  }
}
