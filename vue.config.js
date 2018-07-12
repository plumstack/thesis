module.exports = {
  configureWebpack: {
    output: {
      publicPath: './',
    },
  },
  devServer: {
    proxy: {
      '/spotify': {
        target: 'http://206.189.170.211:8585',
        secure: false,
      },
      '/auth': {
        target: 'http://206.189.170.211:8585',
        secure: false,
      },
      '/dash': {
        target: 'http://206.189.170.211:8585',
        secure: false,
      },
    },
  },
};
