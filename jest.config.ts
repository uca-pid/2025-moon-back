import type { Config } from 'jest';

export default (): Config => {
  return {
    verbose: true,
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      'src/config/',
      'src/main.ts',
      '**/*.module.ts',
      '**/*.interface.ts',
      '**/*.dto.ts',
      '**/*.entity.ts',
      '**/*.spec.ts',
      'data-source.ts',
      'main.ts',
    ],
  };
};
