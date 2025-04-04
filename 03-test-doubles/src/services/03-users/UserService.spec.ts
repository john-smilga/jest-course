// UserService.spec.ts
import { UserService } from './UserService';
import { NewsletterService } from './NewsletterService';
import { DatabaseService } from './DatabaseService';

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

  // test('should successfully register user and return success message', async () => {
  //   const userService = new UserService(mockName, mockEmail);
  //   const result = await userService.registerUser();
  //   expect(result).toEqual(successResponse);
  // });

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

  it('should return error message if name is not provided', async () => {
    const invalidInput = { name: '', email: mockEmail };
    const userService = new UserService(invalidInput.name, invalidInput.email);

    createUserSpy.mockImplementation(() => {
      return Promise.reject('Name is required');
    });

    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(
      invalidInput.name,
      invalidInput.email
    );
    expect(subscribeUserSpy).not.toHaveBeenCalled();
    expect(result).toEqual(errorResponse);
  });
  it('should return error message if email value is not test@test.com', async () => {
    const invalidInput = { name: mockName, email: 'invalid@email.com' };
    const invalidUser = {
      id: 1,
      name: invalidInput.name,
      email: invalidInput.email,
      role: 'user',
    };
    const userService = new UserService(invalidInput.name, invalidInput.email);

    createUserSpy.mockResolvedValue(invalidUser);
    subscribeUserSpy.mockImplementation(() => {
      return Promise.reject('Email is not valid');
    });

    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(
      invalidInput.name,
      invalidInput.email
    );
    expect(subscribeUserSpy).toHaveBeenCalledWith(invalidUser);
    expect(result).toEqual(errorResponse);
  });
});
