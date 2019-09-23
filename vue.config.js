module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  filenameHashing: false,
  devServer: {
    proxy: "https://media.ipsosinteractive.com/"
  },
  configureWebpack: {
    output: {
      jsonpFunction: "survey_shortcuts"
    }
  }
};
