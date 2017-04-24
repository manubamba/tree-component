module.exports = {
  entry: './main.js',
  output: {
    path: `${__dirname}./`,
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    inline: true,
    port: 3333,
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader?sourceMap',
      }],
  },
};
