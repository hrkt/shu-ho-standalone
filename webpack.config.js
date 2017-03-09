var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/page/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
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
      '/Users/hiroki/work/shu-ho-standalone/node_modules',
      'node_modules'
    ],
    alias: {
      vue: 'vue/dist/vue.js',
      'ace-builds': 'ace-builds/src-min-nonconflict/ace.js'
    }
  },
  target: "electron"
};