const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function (config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;

      const badModule = path.join(
        projectRoot,
        "node_modules",
        "@coinbase",
        "wallet-mobile-sdk"
      );

      if (fs.existsSync(badModule)) {
        console.log("🔥 Removing Coinbase native SDK...");
        fs.rmSync(badModule, { recursive: true, force: true });
      } else {
        console.log("👍 Coinbase SDK not found — OK");
      }

      return config;
    },
  ]);
};
