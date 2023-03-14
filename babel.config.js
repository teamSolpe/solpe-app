module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {unstable_transformProfile: 'hermes-stable'},
    ],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@context': './src/context',
          '@assets': './src/assets',
          '@shared': './src/shared',
        },
      },
    ],
  ],
};
