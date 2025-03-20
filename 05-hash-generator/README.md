# Hash Generator Testing Challenge

## Project Overview

## Challenge

Your task is to write tests for a `HashGenerator` class that creates secure, URL-safe hashes. Follow these steps to create a comprehensive test suite:

1. **Basic Instance Creation**

   - Write a test to verify that `HashGenerator.createHashGenerator()` creates a valid instance with a salt value
   - Use `toBeDefined()` and `toBeInstanceOf()` to verify the instance

2. **Instance Uniqueness**

   - Test that calling `createHashGenerator()` multiple times with the same salt creates different instances
   - Use `not.toBe()` to compare instances

3. **URL Safety**

   - Verify that generated hashes are URL-safe (don't contain characters like +, /, or =)
   - Use a regex pattern with `not.toMatch()` to check for invalid characters

4. **Hash Consistency**

   - Test that the same input always produces the same hash output when using the same generator
   - Generate two hashes from the same input and compare them

5. **Input Differentiation**

   - Verify that different inputs produce different hash outputs
   - Generate hashes for two different inputs and ensure they're not equal

6. **Salt Influence**

   - Test that the same input produces different hashes when using different salt values
   - Create two generators with different salts and compare their outputs

7. **Edge Case: Empty Input**
   - Verify that the generator can handle empty string inputs without throwing errors
   - Use `not.toThrow()` to check error handling

Tips:

- Start by setting up your test constants (salt values and test inputs)
- Use descriptive test names that explain what you're testing
- Follow the Arrange-Act-Assert pattern in your tests
- Make sure each test is focused on testing one specific behavior

Good luck! 🚀

## Solution

```ts
import { HashGenerator } from './HashGenerator';

describe('HashGenerator', () => {
  const testSalt = 'testSalt123';
  const differentSalt = 'differentSalt456';
  const randomInput = 'randomInput123';

  it('should create a new instance with hash salt', () => {
    const hashGenerator = HashGenerator.createHashGenerator(testSalt);
    expect(hashGenerator).toBeDefined();
    expect(hashGenerator).toBeInstanceOf(HashGenerator);
  });

  it('should create different instances when called multiple times', () => {
    const generator1 = HashGenerator.createHashGenerator(testSalt);
    const generator2 = HashGenerator.createHashGenerator(testSalt);
    expect(generator1).not.toBe(generator2);
  });

  it('should generate URL-safe hashes', () => {
    const hashGenerator = HashGenerator.createHashGenerator(testSalt);
    const hash = hashGenerator.generateHash(randomInput);

    expect(hash).not.toMatch(/[+/=]/);
  });

  it('should generate consistent hashes for same input', () => {
    const hashGenerator = HashGenerator.createHashGenerator(testSalt);

    const firstHash = hashGenerator.generateHash(randomInput);
    const secondHash = hashGenerator.generateHash(randomInput);

    expect(firstHash).toBe(secondHash);
  });

  it('should generate different hashes for different inputs', () => {
    const hashGenerator = HashGenerator.createHashGenerator(testSalt);
    const differentInput = 'differentInput456';

    const hash1 = hashGenerator.generateHash(randomInput);
    const hash2 = hashGenerator.generateHash(differentInput);

    expect(hash1).not.toBe(hash2);
  });

  it('should generate different hashes with different secrets', () => {
    const generator1 = HashGenerator.createHashGenerator(testSalt);
    const generator2 = HashGenerator.createHashGenerator(differentSalt);

    const hash1 = generator1.generateHash(randomInput);
    const hash2 = generator2.generateHash(randomInput);

    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty input', () => {
    const hashGenerator = HashGenerator.createHashGenerator(testSalt);
    const emptyInput = '';

    expect(() => hashGenerator.generateHash(emptyInput)).not.toThrow();
  });
});
```

# Understanding Code Coverage

Code coverage is a metric that measures how much of your source code is executed during testing. It helps identify untested code paths and potential gaps in your test suite. Coverage tracks different aspects like lines executed, functions called, and branches (if/else paths) tested. While understanding coverage is valuable, as a developer you typically don't need to set up the coverage configuration yourself - it's usually already configured in production projects by the team lead or DevOps. Your main responsibility is to write comprehensive tests that meet the established coverage thresholds (commonly set at 80% or higher). When you run tests, the coverage report will show you if your tests meet these thresholds, and if not, which parts of the code need additional testing. Think of coverage thresholds as quality gates that ensure your code is adequately tested before it can be merged into the main codebase.

**Jest Coverage Configuration**

## Basic Coverage Settings

```typescript
collectCoverage: true,           // Enables coverage collection
coverageDirectory: 'coverage',   // Directory where coverage reports are saved
```

## Coverage Reporters

```typescript
coverageReporters: ['text', 'lcov', 'clover', 'html'],
```

- `text`: Outputs coverage results to the console
- `lcov`: Generates report for tools like Coveralls/SonarQube
- `clover`: Creates an XML report for CI tools
- `html`: Creates a detailed HTML report for browser viewing

You can pick and choose which reporters you need for your project.

## Coverage Thresholds

```typescript
coverageThreshold: {
  global: {
    branches: 80,    // % of branch coverage required
    functions: 80,   // % of function coverage required
    lines: 80,       // % of line coverage required
    statements: 80,  // % of statement coverage required
  }
}
```

These thresholds will cause tests to fail if coverage falls below 80%:

- `branches`: Ensures code paths in control structures (if/else, switch) are tested
- `functions`: Measures how many functions were called during tests
- `lines`: Tracks how many lines of code were executed
- `statements`: Monitors execution of individual statements

## Files to Include/Exclude

```typescript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}', // Include all JS/TS files in src
  '!src/**/*.d.ts', // Exclude TypeScript declaration files
  '!src/**/*.stories.{js,jsx,ts,tsx}', // Exclude Storybook files
  '!src/**/*.test.{js,jsx,ts,tsx}', // Exclude test files
  '!src/setupTests.*', // Exclude test setup files
];
```

- Uses glob patterns to specify which files to include/exclude
- `!` prefix means exclude the pattern
- Ensures coverage is only collected from actual source code

This configuration ensures comprehensive test coverage while excluding irrelevant files from the coverage report.
