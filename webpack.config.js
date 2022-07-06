const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin').default;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');

require('dotenv').config();

const tsConfigPath = path.resolve(__dirname, './tsconfig.webpack.json');

const config = require('./util/config');
const isDev = config.isDev;
const mode = isDev ? 'development' : 'production';

module.exports = {
  entry: './src/client/index.tsx',
  mode,
  devServer: {
    static: {
      directory: `./build/`,
    },
    historyApiFallback: {
      rewrites: [{ from: /./, to: './client/index.html' }],
    },
    compress: true,
    port: 1337,
    host: 'localhost',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              configFile: tsConfigPath,
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: `web_developer__[name]__[local]`,
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/,
        type: 'asset',
        generator: {
          filename: `images/[name].[hash].[ext]`,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  output: {
    filename: '[id]/bundle.[name].[hash].js',
    path: path.resolve(__dirname, 'build'),
  },

  plugins: [
    new MiniCSSExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/template.ejs',
      title: `Web Developer Life`,
      containerId: 'root',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: tsConfigPath,
      },
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
