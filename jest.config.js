module.exports = {
  testEnvironment: 'node', // or 'jsdom' for browser-like environment
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  coverageReporters: ['lcov', 'text-summary', 'html'],
};
