module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "babel-plugin-module-resolver",
        {
          alias: {
            "coinbase-wallet-mobile-sdk": "noop",
            "@coinbase/wallet-mobile-sdk": "noop",
          },
        },
      ],
      "react-native-reanimated/plugin"
    ],
  };
};
