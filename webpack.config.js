const path = require("path");

module.exports = {
  target: "web",
  entry: {
    content: "./src/content.js", // Content script
    popup: "./src/components/Popup.tsx", // React Popup component
    background: "./src/background.js",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js", // Will output `content.js` and `popup.js`
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // Ensure CSS is bundled
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              query: {
                name: "assets/[name].[ext]",
              },
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
              },
            },
          },
        ],
      },
    ],
  },
};
