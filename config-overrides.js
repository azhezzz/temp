const { override, addLessLoader } = require("customize-cra");

module.exports = override(
  // https://github.com/arackaf/customize-cra/issues/201
  // https://github.com/arackaf/customize-cra/pull/185/files
  addLessLoader({
    strictMath: true,
    noIeCompat: true,
    javascriptEnabled: true,
    cssLoaderOptions: {
      modules: { localIdentName: "[name]_[local]_[hash:base64:5]" }
    } // .less file used css-loader option, not all CSS file.
  })
);
