module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  collectCoverage: true,

  // Official project scope: Angular services, Guards/interceptors
  // and components. Files not imported by a test still remain
  // visible in the denominator.
  collectCoverageFrom: [
    'src/app/**/*.component.ts',
    'src/app/core/service/*.service.ts',
    'src/app/core/guard/*.guard.ts',
    'src/app/core/interceptor/*.interceptor.ts',
    '!src/app/**/*.spec.ts'
  ],

  coverageReporters: [
    'text-summary',
    'html',
    'lcov'
  ],

  coverageThreshold: {
    global: {
      lines: 80
    }
  }
};
