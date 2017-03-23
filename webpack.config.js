var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/js/app-main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  resolve: {
    modules: [
      path.resolve('..', 'node_modules'),
      'node_modules'
    ],
    alias: {
      vue: 'vue/dist/vue.js',
      'ace-builds': 'ace-builds/src-min-nonconflict/ace.js'
    }
  },
  target: "electron",
  devtool: 'source-map'
};