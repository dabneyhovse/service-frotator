/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 * Basic webpack cconfig file that tells
 * webpack how to compile all of the client files
 * together
 *
 * this setup copies over images with their
 * og names instead of hashes
 *
 */

const webpack = require("webpack");

let isDev = process.env.NODE_ENV === "development";
isDev = true;
const path = require("path");

module.exports = {
  stats: {
    assets: false,
    builtAt: true,
    moduleAssets: false,
    modules: false,
    performance: false,
    // warnings: false,
  },
  devtool: "source-map",
  mode: isDev ? "development" : "production",
  entry: ["./src/client/index.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "./bundle.js",
    assetModuleFilename: "[path][name].[ext]",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts"],
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
  externals: {
    // Use external version of React
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React",
    },
  },
};
