module.exports = {
  dependencies: {
    // Disable autolinking for the problematic Coinbase SDK
    'coinbase-wallet-mobile-sdk': {
      platforms: {
        android: null, // Disable on Android
      },
    },
    '@coinbase/wallet-mobile-sdk': {
      platforms: {
        android: null, // Disable on Android
      },
    },
  },
};