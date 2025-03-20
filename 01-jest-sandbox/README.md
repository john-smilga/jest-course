# Jest Sandbox

This guide walks you through setting up a minimal Jest testing environment for a TypeScript project.

## 1. Create a New Folder

First, create a new directory for your project and navigate into it:

```sh
mkdir jest-sandbox
cd jest-sandbox
```

## 2. Initialize a Node.js Project

Run the following command to create a `package.json` file with default settings:

```sh
npm init -y
```

This generates a `package.json` file, which will store your project's dependencies and scripts.

## 3. Install Required Packages

```sh
npm install --save-dev ts-node jest ts-jest @types/jest ts-node
```

- `jest` - The core testing framework.
- `ts-jest` - A TypeScript preprocessor for Jest.
- `@types/jest` - TypeScript type definitions for Jest.
- `ts-node` - allows running TypeScript files directly in Node.js:

## 4. Configure Jest

Create a `jest.config.ts` file in the root of the project and add the following configuration:

```ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;
```

### Explanation:

- `preset: 'ts-jest'` - Configures Jest to work with TypeScript.
- `testEnvironment: 'node'` - Uses Node.js as the test runtime.

## 5. Configure TypeScript

Create a `tsconfig.json` file with the following minimal configuration:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

### Explanation:

- `esModuleInterop: true` - Ensures compatibility with ES modules.

The warning from ts-jest suggests enabling "esModuleInterop": true in tsconfig.json to resolve import issues caused by differences between ES modules and CommonJS. Jest runs in a CommonJS environment, while TypeScript enforces strict module compatibility, which can lead to errors when importing CommonJS modules like express using ES module syntax. Enabling "esModuleInterop": true allows TypeScript to handle default imports correctly, ensuring Jest can properly execute tests without module resolution issues. This setting is highly recommended for smooth integration between Jest and TypeScript.

## 6. Writing a Simple Test

Create `src/sum.ts`

```ts
export const sum = (a: number, b: number): number => a + b;
```

Create a `src/__tests__` directory and add a test file named `sum.test.ts` inside it with the following code:

```ts
import { sum } from '../sum';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});
```

## 7. Running Tests

Run Jest using the following command:

```sh
npx jest
```

Alternatively, add a test script in `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

Now, you can run tests using:

```sh
npm test
```

---

This setup provides a minimal working Jest environment for testing TypeScript code. 🚀
