// UserService.ts

import { NewsletterService } from './NewsletterService';
import { UserRepository } from './UserRepository';

export class UserService {
  constructor(private name: string, private email: string) {}

  async registerUser(): Promise<{ msg: string }> {
    try {
      const user = await UserRepository.createUser(this.name, this.email);
      await NewsletterService.subscribeUser(user);
      return { msg: 'user registered successfully' };
    } catch (error) {
      // return { msg: 'failed to register user' };
      throw new Error('failed to register user');
    }
  }
}
