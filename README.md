# Mastering Jest Testing with TypeScript and Node.js

Build solid testing skills with Jest, TypeScript, and Node - from setup to mocks, spies, and production error handling

## **What is Testing**

Testing is a crucial part of software development that ensures code behaves as expected, remains reliable, and prevents regressions. By writing tests, developers can catch errors early, improve code maintainability, and confidently make changes without breaking existing functionality. Different types of testing, such as unit tests, integration tests, and end-to-end tests, help validate various aspects of an application, ensuring a smooth and bug-free user experience.

## **What is Jest**

Jest is a powerful, easy-to-use JavaScript testing framework designed for simplicity and efficiency. It provides built-in assertions, test runners, and mocking capabilities, making it an excellent choice for both frontend and backend testing. With TypeScript support through `ts-jest`, Jest enables developers to write type-safe tests that integrate seamlessly into modern development workflows. Its zero-configuration setup, fast execution, and strong community support make it a go-to solution for testing JavaScript and TypeScript applications.

# Course Outline

## **Module 1: Setting Up Jest for TypeScript Projects**

- Create a new project folder and initialize a Node.js project.
- Install necessary dependencies for TypeScript and Jest.
- Configure Jest with a preset for TypeScript and set the appropriate test environment.
- Update TypeScript configuration for compatibility with Jest.
- Write a simple function and create a corresponding test file.
- Structure test cases using standard Jest methods.
- Run tests using Jest and integrate test execution into the project setup.

## **Module 2: Organizing and Writing Jest Tests**

- Overview of the project structure and test file locations.
- Jest automatically detects test files inside the `__tests__` directory.
- Naming conventions for test files (`.test.js|ts` vs `.spec.js|ts`).
- Different approaches to organizing test files:
  - Placing tests next to the corresponding modules.
  - Keeping tests in a dedicated `__tests__` directory.
- Running a single test file for debugging.
- Using focused tests (`it.only()`) to narrow down issues.
- Logging within test cases to debug test failures.
- Writing Jest tests using:
  - `describe()` for grouping tests.
  - `it()` and `test()` for defining test cases.
  - `expect()` for assertions.
  - `.toBe()` for strict equality comparisons.
  - `.toEqual()` for deep object comparisons.
- Understanding the **System Under Test (SUT)** concept.
- Using the **Arrange-Act-Assert (AAA) pattern** in tests.
- Writing test cases for utility functions:
  - Testing arithmetic functions like `add()` and `subtract()`.
  - Checking boolean functions like `isEven()`.
  - Verifying object creation functions like `createUser()`.
  - Testing asynchronous functions like `createJwtToken()`.
- Understanding and using Jest matchers:
  - `.toBe()` for primitive comparisons.
  - `.toEqual()` for deep object comparisons.
  - `.toHaveLength()` for array length checks.
  - `.toBeTruthy()` and `.toBeFalsy()` for boolean assertions.
- Writing tests for class-based modules:
  - Creating test cases for `Calculator` class.
  - Verifying class methods like `add()`, `subtract()`, and `isPositive()`.
- Using Jest lifecycle hooks for efficient test setup:
  - `beforeEach()` for resetting test conditions before each test.
  - `afterEach()` for cleaning up after each test.
  - `beforeAll()` for setup before running test suites.
  - `afterAll()` for cleanup after all tests run.
- Comparing manual setup vs. using Jest hooks:
  - Benefits of reducing repetition with `beforeEach()`.
  - Maintaining consistent test states across multiple test cases.

## **Module 3: Using Test Doubles (Mocks, Stubs, Fakes, Spies)**

- Understanding **Test Doubles** and their role in testing.
- Types of test doubles:
  - **Dummy** - Used as placeholders in tests.
  - **Stub** - Provides predefined responses without real logic.
  - **Fake** - A working but simplified implementation of a component.
  - **Mock** - A complete override of a dependency.
  - **Spy** - Observes function calls while keeping the original behavior.
- Writing tests using **Dummy Test Doubles**:
  - Creating a test case with a dummy object.
  - Using dummy data to test parameter dependencies.
- Using **Stubs and Fakes**:
  - Creating a **Stub** to control method return values.
  - Implementing a **Fake** to simulate real behavior in memory.
  - Writing tests for an `OrderService` using stubs and fakes.
- Implementing **Spies in Jest**:
  - Using `jest.spyOn()` to track function calls.
  - Overriding function return values dynamically with `mockReturnValue()`.
  - Mocking asynchronous functions with `mockResolvedValue()`.
  - Throwing errors inside spies with `mockImplementation()`.
  - Resetting and restoring spies using:
    - `jest.clearAllMocks()`
    - `jest.resetAllMocks()`
    - `jest.restoreAllMocks()`
- Working with **Mocks in Jest**:
  - Creating mock functions using `jest.fn()`.
  - Mocking an entire module using `jest.mock()`.
  - Understanding Jest's auto-hoisting behavior for mocks.
  - Ensuring all required methods are mocked to prevent undefined errors.
- Writing tests for a **User Service**:
  - Mocking database interactions (`UserRepository`).
  - Mocking external services (`NewsletterService`).
  - Handling errors in API calls using mocks and spies.
- Comparing **Mocks vs. Spies**:
  - Mocks replace the function entirely.
  - Spies track calls but can retain the original behavior.
- Best practices for **managing test doubles**:
  - When to use stubs, fakes, mocks, and spies.
  - Avoiding unnecessary complexity in tests.
  - Keeping test cases isolated and independent.

## **Module 4: Error Handling**

- Understand the importance of testing error scenarios in production-grade applications.
- Learn how to handle and test both expected and unexpected errors using Jest.

- **Error Testing Strategies**:

  - Compare two main approaches:
    - **Declarative Style** with `expect().rejects.toThrow()` for cleaner syntax.
    - **Imperative Style** using `try-catch` blocks for detailed and custom assertions.
  - Use `fail('Should have thrown an error')` to prevent false positives in async test cases.

- **Test Implementation Details**:

  - Spy on service methods (`createUser`, `subscribeUser`) with `jest.spyOn()`.
  - Mock return values or rejections using `mockResolvedValue()` and `mockImplementation()`.

- **Enterprise Error Management**:

  - Integrate custom utility modules for robust error handling:
    - `CustomError` for structured exception throwing.
    - `AppCodes` and `HttpCodes` for standardized error identification.
    - `CustomLogger` for logging contextual data.
  - Simulate and test enterprise-level error propagation in the `UserService`.

- **Verifying Error Parameters**:

  - Spy on `CustomError.throwError()` and assert its call with:
    - Proper HTTP status code (`HttpCodes.INTERNAL_SERVER_ERROR`)
    - Application-level code (`AppCodes.REGISTER_USER_FAILED`)
    - Descriptive message (`'failed to register user'`)

- **Test Cleanup and Mock Management**:

  - Use `jest.restoreAllMocks()` in `afterEach()` to ensure clean test runs.
  - Silence logs during tests by mocking `CustomLogger.error` and `CustomLogger.info` with `jest.fn()`.

- **Real-world Scenarios Covered**:
  - Handle invalid user input (e.g. missing name).
  - Mock failed service interactions (e.g. subscription failure).
  - Validate logger and error service behavior.
  - 
## **Module 5: Hash Generator Testing Challenge**

- Create a comprehensive test suite for the `HashGenerator` class, which generates secure, URL-safe hashes using a salt value.
- Verify instance creation with `createHashGenerator()` and ensure it returns a properly constructed `HashGenerator` object.
- Test instance uniqueness by confirming that repeated calls with the same salt produce different instances.
- Validate URL safety of generated hashes by asserting they do not contain unsafe characters like `+`, `/`, or `=`.
- Write tests to confirm hash consistency: the same input with the same salt should always return the same output.
- Ensure input differentiation by checking that different inputs generate different hashes.
- Demonstrate the influence of salt values by testing that identical inputs produce different hashes when salts differ.
- Include an edge case test to verify that empty input strings do not cause the generator to throw errors.
- Follow best practices like the Arrange-Act-Assert (AAA) pattern, use meaningful test names, and maintain test clarity and independence.
- Understand and apply code coverage metrics in Jest, including configuration for collection, output reporting formats (`text`, `html`, `lcov`, etc.), and enforcing global coverage thresholds (commonly 80% for branches, functions, lines, and statements).
- Learn how to include or exclude files from coverage reports using glob patterns, ensuring meaningful coverage for production code while excluding test files and setup scripts.
