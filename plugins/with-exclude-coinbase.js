const { withDangerousMod, createRunOncePlugin } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function removeCoinbaseSDK(config) {

  return withDangerousMod(config, [
    "android",
    async (config) => {
      const root = config.modRequest.projectRoot;

      // 1. Remove node_modules folder
      const sdkPath = path.join(root, "node_modules", "@coinbase", "wallet-mobile-sdk");
      if (fs.existsSync(sdkPath)) {
        console.log("🔥 Removing Coinbase SDK folder…");
        fs.rmSync(sdkPath, { recursive: true, force: true });
      }

      // 2. Remove Gradle project folder if autolink created it
      const androidProject = path.join(root, "android", "coinbase-wallet-mobile-sdk");
      if (fs.existsSync(androidProject)) {
        console.log("🔥 Removing autolinked Gradle project…");
        fs.rmSync(androidProject, { recursive: true, force: true });
      }

      console.log("✔ Done cleaning Coinbase from prebuild.");

      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(
  removeCoinbaseSDK,
  "with-exclude-coinbase",
  "1.0.0"
);
