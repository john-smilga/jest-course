# Error Testing Patterns with Jest

Review the following files in the users module:

- `src/services/01-users/UserService.ts`
- `src/services/01-users/UserRepository.ts`
- `src/services/01-users/NewsletterService.ts`

You can verify the logic by running the command `npm run dev`
Create a test file and mock external API calls using the spyOn method

UserService.spec.ts

```ts
// UserService.spec.ts
import { UserService } from './UserService';
import { NewsletterService } from './NewsletterService';
import { UserRepository } from './UserRepository';

describe('UserService', () => {
  const successResponse = { msg: 'user registered successfully' };
  const errorResponse = { msg: 'failed to register user' };

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
    createUserSpy = jest.spyOn(UserRepository, 'createUser');
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
it('should return error message if name is not provided', async () => {
  const invalidInput = { name: '', email: mockEmail };
  const userService = new UserService(invalidInput.name, invalidInput.email);

  createUserSpy.mockImplementation(() => {
    return Promise.reject('Name is required');
  });

  await expect(userService.registerUser()).rejects.toThrow(
    'failed to register user'
  );
});
```

- More concise and readable
- Specifically designed for testing Promise rejections
- Less boilerplate code
- Recommended modern approach

## Using try-catch (Imperative Style)

```ts
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
