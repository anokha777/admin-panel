const { override, fixBabelImports, addLessLoader } = require('customize-cra');
// you can also use craco instead of customize-cra, 
// which is now the most updated way in their current docs.

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),

  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#6237a0',
      '@link-color': '#6237a0',
      '@success-color': '#0ea70e',
      '@steps-nav-arrow-color': '#d1cdd6',
    },
  }),
);