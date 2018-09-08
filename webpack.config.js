module.exports = {
  entry: "./src/app/main.js",
  target: "web",
  module: {
    rules: [
      { test: /src\/\*.js$/, use: "raw-loader" },
      { test: /src\/\.html$/, use: "text-loader" },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader", // translates CSS into CommonJS
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
    ],
  },
  node: {
    fs: "empty", // https://github.com/webpack-contrib/css-loader/issues/447s
  },
};
