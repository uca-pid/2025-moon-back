import type { Config } from 'jest';

export default (): Config => {
  return {
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^src/(.*)': '<rootDir>/$1',
    },
    moduleFileExtensions: ['js', 'json', 'ts'],
    verbose: true,
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      '/src/config/',
      '/src/main.ts',
      '\\.module\\.ts$',
      '\\.interface\\.ts$',
      '\\.dto\\.ts$',
      '\\.entity\\.ts$',
      '\\.spec\\.ts$',
      'data-source\\.ts$',
      'main\\.ts$',
    ],
  };
};
