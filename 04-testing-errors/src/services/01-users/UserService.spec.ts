// UserService.spec.ts
import { UserService } from './UserService';
import { NewsletterService } from './NewsletterService';
import { UserRepository } from './UserRepository';
import { CustomError } from '../../utils/CustomError';
import { AppCodes } from '../../utils/AppCodes';
import { HttpCodes } from '../../utils/HttpCodes';
import { CustomLogger } from '../../utils/CustomLogger';
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
  let customErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    createUserSpy = jest.spyOn(UserRepository, 'createUser');
    subscribeUserSpy = jest.spyOn(NewsletterService, 'subscribeUser');
    customErrorSpy = jest.spyOn(CustomError, 'throwError');
    CustomLogger.error = jest.fn();
    CustomLogger.info = jest.fn();
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
      expect(customErrorSpy).toHaveBeenCalledWith(
        HttpCodes.INTERNAL_SERVER_ERROR,
        AppCodes.REGISTER_USER_FAILED,
        'failed to register user'
      );
    }
  });
});
