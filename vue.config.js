module.exports = {
  devServer: {
    proxy: {
      '/spotify': {
        target: 'http://localhost:8082',
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8082',
        secure: false,
      },
      '/dash': {
        target: 'http://localhost:8082',
        secure: false,
      },
    },
  },
};
