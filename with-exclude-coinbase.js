const { withSettingsGradle, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// This function removes the module reference from settings.gradle and physically deletes the folder.
module.exports = function withExcludeCoinbase(config) {
  
  // 1. Remove the module reference from settings.gradle (Guaranteed deletion of the line)
  config = withSettingsGradle(config, (config) => {
    const newContents = [];
    const lines = config.modResults.contents.split('\n');
    for (const line of lines) {
      // Filter out any line that references 'coinbase' for total safety
      if (line.includes('coinbase')) {
        continue; 
      }
      newContents.push(line);
    }
    config.modResults.contents = newContents.join('\n');
    return config;
  });

  // 2. PHYSICALLY DELETE the android folder from the node_module (The Nuclear Option)
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      
      // Define the path to the problematic android folder
      const coinbaseAndroidPath = path.join(
        projectRoot,
        'node_modules',
        '@coinbase',
        'wallet-mobile-sdk',
        'android'
      );

      // We use fs.rmSync to synchronously delete the folder during the prebuild phase.
      // This is a forced operation.
      if (fs.existsSync(coinbaseAndroidPath)) {
        console.log(`[with-exclude-coinbase] Forcibly deleting native module folder.`);
        fs.rmSync(coinbaseAndroidPath, { recursive: true, force: true });
        console.log(`[with-exclude-coinbase] Folder successfully deleted. Gradle should now ignore it.`);
      }
      
      return config;
    },
  ]);

  return config;
};