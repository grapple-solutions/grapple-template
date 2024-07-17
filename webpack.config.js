const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const webpack = require("webpack");
const sveltePreprocess = require("svelte-preprocess");
const includeEnv = require("svelte-environment-variables");

const mode = process.env.NODE_ENV || "development";
// const mode = process.env.NODE_ENV || "production";
const prod = mode === "production";

const App =
  mode == "production"
    ? `${process.env.CONTAINER_NAME}@${process.env.SVELTE_APP_REMOTE_URL}/remoteEntry.js`
    : `${process.env.CONTAINER_NAME}@${process.env.REMOTE_ENTRY_URL}`;

module.exports = {
  entry: "./src/main.ts",

  output: {
    path: __dirname + "/public",
    // in prod it is to auto.  localhost:8080 is used for development
    publicPath: "/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },

  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },

  devServer: {
    allowedHosts: "all",
    port: 4000,
    historyApiFallback: {
      index: "/",
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: true, // Default: false
            },
            emitCss: true,
            hotReload: true,
            preprocess: sveltePreprocess({ sourceMap: true }),
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
      },
      {
        test: /\.ttf?$/i,
        type: "asset/resource",
        dependency: { not: ["url"] },
      },
      {
        test: /\.(png|jpe?g|gif|pdf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },

  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      chunks: ["main"],
    }),
    new webpack.DefinePlugin({
      ...includeEnv(),
    }),
    new ModuleFederationPlugin({
      // only alphanumeric characters are allowed.
      name: "consumer",
      remotes: {
        App,
      },
    }),
  ],
  devtool: prod ? false : "source-map",
};
