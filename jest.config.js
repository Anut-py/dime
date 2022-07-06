/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/out/"],
  testResultsProcessor: "jest-sonar-reporter",
  collectCoverage: true,
  testResultsProcessor: "jest-sonar-reporter",
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/([^/]*/)*[^\\.]*.spec.ts"
  ]
};