// Detox configuration placeholder for end-to-end tests
// To fully configure Detox, add detox dependency and configure .detoxrc.json

const config = {
  preset: 'jest-circus/runner',
  testTimeout: 120000,
  testEnvironment: 'node',
  reporters: ['default'],
};

module.exports = config;
