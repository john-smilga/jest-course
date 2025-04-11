# Error Testing Patterns with Jest

- UserService.ts

```ts
// UserService.ts

import { NewsletterService } from './NewsletterService';
import { DatabaseService } from './DatabaseService';

export class UserService {
  constructor(private name: string, private email: string) {}

  async registerUser(): Promise<{ msg: string }> {
    try {
      const user = await DatabaseService.createUser(this.name, this.email);
      await NewsletterService.subscribeUser(user);
      return { msg: 'user registered successfully' };
    } catch (error) {
      throw new Error('failed to register user');
    }
  }
}
```

Review the following files in the users module:

- `src/services/01-users/UserService.ts`
- `src/services/01-users/UserRepository.ts`
- `src/services/01-users/NewsletterService.ts`

You can verify the logic by running the command `npm run dev`

## Challenge

Create a test file and mock external API calls using the spyOn method

UserService.spec.ts

```ts
// UserService.spec.ts
import { UserService } from './UserService';
import { NewsletterService } from './NewsletterService';
import { DatabaseService } from './DatabaseService';

describe('UserService', () => {
  const successResponse = { msg: 'user registered successfully' };

  const mockName = 'John Doe';
  const mockEmail = 'test@test.com';
  const mockUser = {
    id: 1,
    name: mockName,
    email: mockEmail,
    role: 'user',
  };

  let createUserSpy: jest.SpyInstance;
  let subscribeUserSpy: jest.SpyInstance;

  beforeEach(() => {
    createUserSpy = jest.spyOn(DatabaseService, 'createUser');
    subscribeUserSpy = jest.spyOn(NewsletterService, 'subscribeUser');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully register user and return success message', async () => {
    const userService = new UserService(mockName, mockEmail);
    createUserSpy.mockResolvedValue(mockUser);
    subscribeUserSpy.mockResolvedValue({ msg: 'success' });
    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(mockName, mockEmail);
    expect(subscribeUserSpy).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(successResponse);
  });
});
```

# Two Common Approaches to Testing Error Handling

## Using expect().rejects (Declarative Style)

```ts
it('should throw error message if name is not provided', async () => {
  const invalidInput = { name: '', email: mockEmail };
  const userService = new UserService(invalidInput.name, invalidInput.email);

  createUserSpy.mockImplementation(() => {
    return Promise.reject('Name is required');
  });

  // for async function
  await expect(userService.registerUser()).rejects.toThrow();
  await expect(userService.registerUser()).rejects.toThrow(
    'failed to register user'
  );
  // for sync function
  // expect(() => userService.registerUser()).toThrow();
});
```

- More concise and readable
- Specifically designed for testing Promise rejections
- Less boilerplate code
- Recommended modern approach

## Using try-catch (Imperative Style)

```ts
it('should throw error message if name is not provided', async () => {
  const invalidInput = { name: '', email: mockEmail };
  const userService = new UserService(invalidInput.name, invalidInput.email);

  createUserSpy.mockImplementation(() => {
    return Promise.reject('Name is required');
  });

  try {
    await userService.registerUser();
    fail('Should have thrown an error');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('failed to register user');
  }
});
```

- More verbose but offers greater control
- Allows multiple assertions in catch block
- Useful for complex error scenarios
- Traditional error handling pattern
- Better for testing custom error types and their properties
- Allows type narrowing for custom error classes

# Enterprise Error Management

In production environments, error handling goes far beyond simply throwing and catching errors. A robust error management system typically integrates custom loggers and error classes with additional functionality.

Review the following files in the utils folder:

- `src/utils/AppCodes.ts`
- `src/utils/HttpCodes.ts`
- `src/utils/CustomError.ts`
- `src/utils/CustomLogger.ts`

Update `UserService.ts`

```ts
// UserService.ts

import { NewsletterService } from './NewsletterService';
import { DatabaseService } from './DatabaseService';
// EXTRA IMPORTS
import { AppCodes } from '../../utils/AppCodes';
import { CustomError } from '../../utils/CustomError';
import { HttpCodes } from '../../utils/HttpCodes';
import { CustomLogger } from '../../utils/CustomLogger';

export class UserService {
  constructor(private name: string, private email: string) {}

  async registerUser(): Promise<{ msg: string }> {
    try {
      const user = await DatabaseService.createUser(this.name, this.email);
      await NewsletterService.subscribeUser(user);
      // ADD CUSTOM LOGGER
      CustomLogger.info(
        'UserService registerUser',
        AppCodes.REGISTER_USER_SUCCESS,
        {
          user,
        }
      );
      return { msg: 'user registered successfully' };
    } catch (error) {
      // THROW CUSTOM ERROR
      CustomError.throwError(
        HttpCodes.INTERNAL_SERVER_ERROR,
        AppCodes.REGISTER_USER_FAILED,
        'failed to register user'
      );
    }
  }
}
```

## Testing Error Parameters

In this test case, we're using Jest's spy functionality to verify the exact behavior of our error handling system. When the `registerUser` method fails due to an empty name, we don't just check that an error was thrown - we specifically verify that `CustomError.throwError()` was called with three precise parameters:

- The correct HTTP status code (INTERNAL_SERVER_ERROR)
- The specific application error code (REGISTER_USER_FAILED)
- The exact error message ('failed to register user')

This granular level of testing ensures our error handling remains consistent and properly categorized throughout the application.

```ts
import { UserService } from './UserService';
import { NewsletterService } from './NewsletterService';
import { DatabaseService } from './DatabaseService';
// EXTRA IMPORTS
import { CustomError } from '../../utils/CustomError';
import { AppCodes } from '../../utils/AppCodes';
import { HttpCodes } from '../../utils/HttpCodes';

describe('UserService', () => {
  const successResponse = { msg: 'user registered successfully' };
  const mockName = 'John Doe';
  const mockEmail = 'test@test.com';
  const mockUser = {
    id: 1,
    name: mockName,
    email: mockEmail,
    role: 'user',
  };

  let createUserSpy: jest.SpyInstance;
  let subscribeUserSpy: jest.SpyInstance;
  // CREATE NEW SPY INSTANCE
  let customErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    createUserSpy = jest.spyOn(DatabaseService, 'createUser');
    subscribeUserSpy = jest.spyOn(NewsletterService, 'subscribeUser');
    // SETUP jest.spyOn
    customErrorSpy = jest.spyOn(CustomError, 'throwError');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully register user and return success message', async () => {
    const userService = new UserService(mockName, mockEmail);
    createUserSpy.mockResolvedValue(mockUser);
    subscribeUserSpy.mockResolvedValue({ msg: 'success' });
    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(mockName, mockEmail);
    expect(subscribeUserSpy).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(successResponse);
  });
  it('should return error message if name is not provided', async () => {
    const invalidInput = { name: '', email: mockEmail };
    const userService = new UserService(invalidInput.name, invalidInput.email);

    createUserSpy.mockImplementation(() => {
      return Promise.reject('Name is required');
    });

    try {
      await userService.registerUser();
      fail('Should have thrown an error');
    } catch (error) {
      // CHECK FOR SPECIFIC ERROR
      expect(error).toBeInstanceOf(CustomError);
      expect(customErrorSpy).toHaveBeenCalledWith(
        HttpCodes.INTERNAL_SERVER_ERROR,
        AppCodes.REGISTER_USER_FAILED,
        'failed to register user'
      );
    }
  });
});
```

## Preventing False Positive Tests

When testing error scenarios, it's crucial to catch cases where errors unexpectedly don't occur. Without the `fail('Should have thrown an error')` statement, this test would silently pass even if no error was thrown - creating a dangerous false positive. The `fail()` function ensures that if the code execution reaches a point where we expected an error but didn't get one, the test will explicitly fail with our custom message. This is particularly important in async/await scenarios where error handling behavior might change due to refactoring or bug fixes.

```ts
it('should return error message if name is not provided', async () => {
  const userService = new UserService(mockName, mockEmail);
  createUserSpy.mockResolvedValue(mockUser);
  subscribeUserSpy.mockResolvedValue({ msg: 'success' });

  try {
    await userService.registerUser();
    // without fail test will pass
    // fail('Should have thrown an error');
  } catch (error) {
    expect(error).toBeInstanceOf(CustomError);
    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.INTERNAL_SERVER_ERROR,
      AppCodes.REGISTER_USER_FAILED,
      'failed to register user'
    );
  }
});
```

## Suppressing Logger Output in Tests

When running test suites, having numerous log messages in the console can make it difficult to spot actual test failures and important debugging information. By mocking the logger's methods (`CustomLogger.error` and `CustomLogger.info`) with Jest's `jest.fn()`, we effectively silence all logging output during test execution. This keeps our test output clean and focused on test results rather than application logs. While logging is crucial in production, during testing it's often more of a distraction than a help.

```ts
import { CustomLogger } from '../../utils/CustomLogger';
// jest.mock('../../utils/CustomLogger');
beforeEach(() => {
  // rest of the code
  CustomLogger.error = jest.fn();
  CustomLogger.info = jest.fn();
});
```
