options: {
    query: {
      name: "assets/[name].[ext]",
    },
  },

  {
    loader: 'babel-loader',
    options: {
        query: {
            name: "assets/[name].[ext]",
          },
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        'react-refresh/babel', // Add React Refresh babel plugin
      ],
    },
  },