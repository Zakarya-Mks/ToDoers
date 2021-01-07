const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
