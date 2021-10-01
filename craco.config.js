const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#011F5B',
            '@link-color': '#6237a0',
            '@success-color': '#0ea70e',
            '@steps-nav-arrow-color': '#FFB800',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};