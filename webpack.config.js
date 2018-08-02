const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const styles = {
  test: /\.scss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader", // translates CSS into CommonJS
      options: {
        sourceMap: true
      }
    },
    "postcss-loader",
    {
      loader: "sass-loader", // compiles Sass to CSS
      options: {
        sourceMap: true
      }
    }
  ]
};

const javascript = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader"
  }
};

const urlLoader = { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }

const config = {
  entry: {
    app: ["babel-polyfill", "./app/main.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js"
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./dist"
  },
  module: {
    rules: [javascript, styles, urlLoader]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebpackPlugin({
      title: "tttest",
      template: './app/index.html',
      filename: "./index.html"
    })
  ]
};


module.exports = config;


