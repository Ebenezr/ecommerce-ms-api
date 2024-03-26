const config = {
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/schema.js', '!src/resolvers.js'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testResultsProcessor: 'jest-sonar-reporter',
};
