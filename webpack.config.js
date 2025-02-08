const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'prod/extension')
  },
  mode: 'production',
  target: 'web'
};
