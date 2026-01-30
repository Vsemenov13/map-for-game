const path = require('path');
const paths = require('../paths');
const proxy = require('./proxy');

const publicDir = path.resolve(__dirname, '../../public');

module.exports = {
  devServer: {
    port: 3000,
    allowedHosts: 'all',
    open: true,
    static: [
      paths.appDist,
      { directory: publicDir, publicPath: '/' },
    ],
    historyApiFallback: true,
    hot: true,
    proxy,
  },
};
