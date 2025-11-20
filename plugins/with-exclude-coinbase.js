const { withDangerousMod, createRunOncePlugin } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function removeCoinbaseSDK(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const root = config.modRequest.projectRoot;

      const target = path.join(
        root,
        "node_modules",
        "@coinbase",
        "wallet-mobile-sdk"
      );

      console.log("🔍 Checking for Coinbase SDK at:", target);

      if (fs.existsSync(target)) {
        console.log("🔥 DELETE: Coinbase SDK FOUND — Removing...");
        fs.rmSync(target, { recursive: true, force: true });
      } else {
        console.log("✔ Coinbase SDK not present. Safe.");
      }

      return config;
    },
  ]);
}

// Proper plugin metadata required for EAS
module.exports = createRunOncePlugin(
  removeCoinbaseSDK,
  "with-exclude-coinbase",
  "1.0.0"
);
