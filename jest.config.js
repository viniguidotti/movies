module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/**/*.module.ts",
    "!src/app/**/main.ts",
    "!src/app/**/environment*.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text", "lcov"],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
};
