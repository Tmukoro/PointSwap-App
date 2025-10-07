const { getDefaultConfig } = require("expo/metro-config"); // or require("metro-config").getDefaultConfig for bare React Native

module.exports = (() => {
  const config = getDefaultConfig(__dirname, {isCSSEnabled: true});
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"), // or "react-native-svg-transformer" for bare React Native
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  config.resolver.sourceExts.push('mjs')


  return config;
})();