const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  devServer: {
    historyApiFallback: true,
  },

  mode: 'development',

  entry: {
    main: './src/index.tsx',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  resolve: {
    alias: {
      containers: path.resolve(__dirname, 'src/containers'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      }, {
        test: /.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Redux Action Cache - Web Example',
      template: './src/index.html',
    }),
  ],

}
