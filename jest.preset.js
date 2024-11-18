const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testEnvironment: 'jest-fixed-jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(package-to-transform|another-package)/)',
  ],
};
