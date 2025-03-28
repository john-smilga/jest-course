# Jest Tutorial

Project overview :

- `node_modules` - Contains all project dependencies
- `src` - Source code files that will be tested
- `src/__tests__` - Directory where our test files will be written
- `README.md` - Documentation with notes, instructions, and explanations

Install dependencies

```sh
npm i
```

## Test File Location

Jest provides a few default methods for locating test files:

- If a `__tests__` directory exists, Jest will automatically load all files within it, regardless of their filenames.
- It searches for any file ending in `*.spec.js|ts` or `*.test.js|ts`, scanning all directories under the project's root recursively.
- In our example, we have both `__tests__` folder and file name with `spec` to maintain consistency.
- Personally, I prefer using `spec`,when naming test files as it's the convention followed in my work projects.

You can configure how Jest locates test files in `jest.config.ts`(cover later).

There are two common approaches:

- Some developers prefer placing test files next to the corresponding files or modules (e.g., `src/sum.spec.ts`).
- Others prefer organizing all test files within a dedicated test directory (e.g., `src/__test__/sum.spec.ts`).

Neither approach is inherently right or wrong—what matters is maintaining consistency in your project.

### My Approach

I personally prefer this approach : run only one test file and if I have hard time debugging the test, I run only one test case.

At the moment we have only one file, but quite often it's not the case

```sh
npm test -- fileName.spec.ts
```

```sh
npm test -- sum.spec.ts
```

```ts
it.only('should handle negative numbers', () => {
  const result = sum(-1, -2);
  expect(result).toBe(-3);
});
```

The reason why I prefer such approach is because in production codebase tests, once in a while you will need to log stuff, and this way i'm not getting too many logs, so it's easy to narrow down the issue.

```ts
export const sum = (a: number, b: number): number => {
  console.log('sum', a, b);
  return a + b;
};
```

## Jest 101

```ts
import { add } from '../utils';

describe('Utils', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

This code is a simple Jest test for the `add` function imported from `../utils`. Below is a detailed breakdown of each part of the code.

### 1. Importing the Function to Test

```ts
import { add } from '../utils';
```

- The `import` statement brings in the `add` function from the `utils` module.
- This allows the test to call the `add` function and verify its behavior.

### 2. Jest `describe` Block

```ts
    describe('Utils', () => {
```

- The `describe` function is a Jest global function used to group related test cases together.
- It takes two arguments:
  - A string (`Utils`) that names the group of tests (for example the main class you are testing)
  - A callback function that contains the test cases.
  - we can nest `describe`

### 3. Jest `it` Block (Alias for `test`)

```ts
    it('should add two numbers', () => {
```

```ts
    test('should add two numbers', () => {
```

- The `it` function defines an individual test case.
- It takes two arguments:
  - A string (`'should add two numbers'`) describing the purpose of the test.
  - A callback function that contains the actual test logic.
- `it` is an alias for `test`, so you could also write:

  test('should add two numbers', () => { ... });

### 4. Jest `expect` Function

```ts
expect(add(1, 2)).toBe(3);
```

- The `expect` function is used to define an assertion (a condition that must be met).
- It accepts variables, function results, or direct function invocations as arguments.
- It is followed by a **matcher** (`toBe(3)`) that checks the expected output.

## 5. Jest Matcher `.toBe()`

- `.toBe(3)` is a Jest matcher that checks if the returned value is **strictly equal** to the value being passed in.

- This matcher should only be used for primitive values (numbers, strings, booleans, undefined, null).

- This means:

  - It checks both **value** and **type** (like `===` in JavaScript).
  - Example:

```ts
expect(5).toBe(5); // ✅ Passes
expect(5).toBe('5'); // ❌ Fails (string vs number)
```

### Empty Test Cases

- By default, an **empty test case** in Jest passes automatically. This is because Jest doesn't evaluate any logic, so there is no failure condition. For example:

  ```ts
  it('should do nothing', () => {});
  ```

- While this might be useful for setting up a test skeleton, it is generally not recommended for meaningful testing.

### Jest Matchers

- Jest comes with a **variety of matchers** (like `.toBe()`, `.toEqual()`, `.toBeTruthy()`, `.toHaveLength()`, etc.) that allow you to check different types of conditions.
- There are **quite a few matchers** in Jest, so there's no need to memorize them all. You can always refer to the [Jest documentation](https://jestjs.io/docs/expect) for the full list of matchers.

### Understanding the "SUT" (System Under Test) Concept and the Arrange-Act-Assert Pattern in Testing

SUT stands for **System Under Test**. It refers to the specific function, module, or component that is being tested in a unit test. The idea is to make the test code more **structured and readable** by explicitly defining what is being tested.

The **Arrange-Act-Assert (AAA) pattern** is a widely used approach in unit testing that improves test readability and organization. It consists of three steps:

1. **Arrange** – Set up the necessary test data and environment.
2. **Act** – Call the function being tested (SUT).
3. **Assert** – Verify that the expected result matches the actual output.

This pattern ensures that tests are **structured, easy to read, and clearly separate setup from verification**.

- Example Without SUT and AAA Pattern

```ts
describe('add function', () => {
  it('should return the sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

This works, but it **lacks structure**, making it harder to read and modify.

- Example Using SUT and the Arrange-Act-Assert Pattern

```ts
describe('add function', () => {
  it('should return the sum of two numbers', () => {
    // Arrange
    const a = 2;
    const b = 3;

    // Act
    const sut = add(a, b); // System Under Test

    // Assert
    expect(sut).toBe(5);
  });
});
```

- How This Improves the Test:

1. **Arrange**: We define the input values (`a` and `b`), making it clear what data is being used.
2. **Act**: We store the result of the `add` function inside `sut`, explicitly defining the System Under Test.
3. **Assert**: We check if the output (`sut`) matches the expected value.

## Jest Testing: Practical Introduction

- Explore `src/utils.ts`
- Create a test file: `__tests__/utils.spec.ts`.
- Import all functions from `utils.ts`.
- Set up test cases for the functions.
- Use the complete test code examples below as a reference for implementation.

utils.spec.ts

```ts
import {
  add,
  subtract,
  isEven,
  createUser,
  createJwtToken,
  calculateAverage,
} from '../utils';

describe('Utility Functions', () => {
  it('adds two positive numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('subtracts two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  it('returns true for even numbers', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(0)).toBe(true);
  });

  it('returns false for odd numbers', () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(99)).toBe(false);
  });

  it('creates user object with correct properties', () => {
    const user = createUser('John Doe', 30);
    expect(user).toEqual({ name: 'John Doe', age: 30 });
    expect(user).not.toEqual({ name: 'Susan Doe', age: 25 });
  });

  it('should create a jwt token', async () => {
    const token = await createJwtToken();
    expect(token).toBe('jwt_token');
  });

  it('calculates average correctly for non-empty arrays', () => {
    expect(calculateAverage([2, 4, 6, 8])).toBe(5);
    expect(calculateAverage([6])).toBe(6);
  });

  it('calculates average correctly for empty arrays', () => {
    expect(calculateAverage([])).toBe(0);
  });
});
```

### Difference Between `.toBe()` and `.toEqual()`

- `.toBe()`

- Uses **strict equality (`===`)**.
- Works for **primitive values** like numbers, strings, and booleans.
- Fails for objects or arrays, even if their contents are identical.

```ts
expect(5).toBe(5); // ✅ Passes
expect({ a: 1 }).toBe({ a: 1 }); // ❌ Fails (different object references)
```

- `.toEqual()`

- Checks **deep equality**, meaning it compares objects and arrays **by value** instead of reference.
- Works for **nested structures**.

```ts
expect({ a: 1 }).toEqual({ a: 1 }); // ✅ Passes
expect([1, 2, 3]).toEqual([1, 2, 3]); // ✅ Passes
```

- When to Use Each?

- **Use `.toBe()`** for primitive values.
- **Use `.toEqual()`** for objects, arrays, or complex structures.

## Class Example

- Explore `src/Calculator.ts` to understand its functionality.
- Create a test file: `__tests__/Calculator.spec.ts`.
- Import the `Calculator` class, create an instance, and write test cases.
- Use the complete test code examples below as a reference for implementation.

### **Test Without Hooks (`Calculator.test.ts`)**

```ts
import Calculator from '../Calculator';

describe('Calculator', () => {
  it('should start with value 0', () => {
    const calculator = new Calculator();
    expect(calculator.value).toBe(0);
  });

  it('should add a number to the current value', () => {
    const calculator = new Calculator();
    expect(calculator.add(5)).toBe(5);
  });

  it('should subtract a number from the current value', () => {
    const calculator = new Calculator();
    calculator.add(10); // Set initial value
    expect(calculator.subtract(3)).toBe(7);
  });

  it('should return false when value is not positive', () => {
    const calculator = new Calculator();
    expect(calculator.isPositive()).not.toBeTruthy();
  });

  it('should return true when value is positive', () => {
    const calculator = new Calculator();
    calculator.add(1);
    expect(calculator.isPositive()).toBeTruthy();
  });
});
```

### **Problem Without Hooks**

- We **manually create a new `Calculator` instance** in every test.
- This is **repetitive** and makes tests harder to maintain.

---

### **Test With Hooks (`Calculator.test.ts`)**

```ts
import Calculator from '../Calculator';

describe('Calculator', () => {
  let sut: Calculator;

  beforeEach(() => {
    sut = new Calculator(); // System Under Test
  });

  it('should start with value 0', () => {
    expect(sut.value).toBe(0);
  });

  it('should add a number to the current value', () => {
    expect(sut.add(5)).toBe(5);
  });

  it('should subtract a number from the current value', () => {
    sut.add(10); // Set initial value
    expect(sut.subtract(3)).toBe(7);
  });

  it('should return false when value is not positive', () => {
    expect(sut.isPositive()).not.toBeTruthy();
  });

  it('should return true when value is positive', () => {
    sut.add(1);
    expect(sut.isPositive()).toBeTruthy();
  });
});
```

### **Why Use Jest Hooks?**

Jest provides several lifecycle hooks to manage test setup and teardown efficiently.

- **`beforeEach`** – Runs before each test, ensuring a fresh setup for every test case.
- **`afterEach`** – Runs after each test, useful for cleanup tasks like resetting mocks.
- **`beforeAll`** – Runs once before all tests in a suite, ideal for expensive setup operations.
- **`afterAll`** – Runs once after all tests in a suite, useful for global teardown like closing connections.

Without Hooks ❌:

- Manually sets up test conditions in every test 🛠️
- Repetitive and cluttered code 🌀
- Harder to manage dependencies 😓

With Hooks ✅:

- Automates setup and cleanup for better efficiency ⚡
- More structured and maintainable test cases 🧹
- Ensures consistency across multiple tests 🔄
