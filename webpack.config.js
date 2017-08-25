const path = require('path')
const dev = process.env.NODE_ENV === 'dev'
const parts = require('./webpack.parts')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')


const PATHS = {
  src : path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}


let commonConfig = merge([
  {
    entry: PATHS.src,
    watch: true,
    output: {
      path: PATHS.dist,
      filename: dev ? 'bundle.js' : 'bundle.[chunkhash:8].js'
    },
    devtool: dev ? 'cheap-module-eval-source-map' : false,
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: dev ? '[name].css' : '[name].[contenthash:8].css'
      }),
      new HtmlWebpackPlugin({
        template: './index.ejs'
      })
        
    ]
  }
])

const prodConfig = merge([
  parts.extractCSS(),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]'
    }
  })
])

const devConfig = merge([
  parts.loadCSS(),
  parts.loadImages(),
  parts.devServer()
])

if (!dev) {
  // config.plugins.push(new CleanWebpackPlugin(['dist']))
  // config.plugins.push(
  //     new webpack.optimize.CommonsChunkPlugin({
  //         names: ['vendor', 'manifest']
  //     })
  // )
  // config.plugins.push(new ManifestPlugin())
}

module.exports = () => {
  if (dev) {
    return merge(commonConfig, devConfig)
  }

  return merge(commonConfig, prodConfig)
}