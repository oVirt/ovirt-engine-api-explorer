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
  entry: path.resolve(srcDir, 'main.js'),

  output: {
    path: outDir,
    filename: 'main.js'
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
              'env',
              'react'
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

  plugins: [
    // Some of the libraries that we use, like bootstrap, datatables.net and patternfly, assume that
    // jQuery is loaded and available globally, so we need to make sure that we replace references
    // to the '$' and 'jQuery' names with references to the module loade by webpack.
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),

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
    outputPath: outDir,
    inline: true,
    port: 8000,
    proxy: {
      '/ovirt-engine/apidoc/model.json': {
        target: 'http://engine42.local',
        secure: false
      }
    }
  }
}
