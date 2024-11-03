const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const srcDir = path.join(__dirname, "..", "src");
const outputDir = path.join(srcDir, "..", "dist");

module.exports = {
  entry: {
    content_script: path.join(srcDir, "content_script", "content_script.js"),
    background: path.join(srcDir, "background", "background.js"),
    popup: path.join(srcDir, "popup", "popup.ts"),
  },

  output: {
    filename: "[name].bundle.js",
    path: path.join(outputDir, "script"),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(srcDir, "..", "public"),
          to: outputDir,
          globOptions: {
            dot: false,
            ignore: ["**/test/**"],
          },
        },
      ],
      options: {},
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
    ],
  },
};
