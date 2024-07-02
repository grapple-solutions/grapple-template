const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

const sveltePreprocess = require("svelte-preprocess");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  output: {
    // publicPath: prod?  "/modules/": "http://localhost:4001/",
    publicPath: "auto",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },

  devServer: {
    port: 4000,
    historyApiFallback: true,
    allowedHosts: "all",
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: !prod, // Default: false
            },
            emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({ sourceMap: true }),
          },
        },
      },
      {
        test: /\.(m?js|ts)/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
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
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  mode,

  plugins: [
    new ModuleFederationPlugin({
      name: "client",
      filename: "remoteEntry.js",
      remotes: {
        // Change the remote name to match with the exposed module's name
        App: `${process.env.CONTAINER_NAME}@${process.env.SVELTE_APP_REMOTE_URL}/remoteEntry.js`,
      },
      exposes: {},
      shared: {},
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
  devtool: prod ? false : "source-map",
};
