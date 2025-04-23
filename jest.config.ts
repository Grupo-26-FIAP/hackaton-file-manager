import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@Controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@Infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@Repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@Services/(.*)$': '<rootDir>/src/services/$1',
    '^@Shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@Test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/features/',
    '/dist/',
    '/src/shared/',
    '/src/infrastructure/',
    'app.module.ts',
    'main.ts',
    '.eslintrc.js',
    'jest.config.ts',
    'cucumber.js',
    '/test/',
  ],
  coverageReporters: ['html', 'text', 'lcov'],
};

export default config;
