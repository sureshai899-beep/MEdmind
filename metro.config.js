const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Configure resolver to handle Node.js modules that axios tries to import
config.resolver = {
    ...config.resolver,
    extraNodeModules: {
        crypto: require.resolve('expo-crypto'),
        stream: require.resolve('readable-stream'),
        buffer: require.resolve('buffer'),
    },
};

module.exports = withNativeWind(config, {
    input: path.resolve(__dirname, "global.css"),
    configPath: path.resolve(__dirname, "tailwind.config.js")
});
