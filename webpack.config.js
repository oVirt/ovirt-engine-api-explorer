/*
Copyright (c) 2017 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const modDir = path.resolve(__dirname, 'node_modules')
const srcDir = path.resolve(__dirname, 'src')
const rscDir = path.resolve(__dirname, 'static')
const outDir = path.resolve(__dirname, 'build')

module.exports = {
  entry: {
    index: path.resolve(srcDir, 'index.js'),
    dependencies: path.resolve(srcDir, 'dependencies.js')
  },

  output: {
    path: outDir,
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },

  externals: {
     jquery: 'jQuery'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        dependencies: {
          filename: '[name].js',
        }
      }
    }
  },

  plugins: [
    // Copy the static files to the output directory:
    new CopyWebpackPlugin([
      { from: rscDir, to: outDir }
    ])
  ],

  resolve: {
    modules: [
      srcDir,
      modDir
    ]
  },

  devServer: {
    contentBase: outDir,
    inline: true,
    port: 8000,
  }
}
