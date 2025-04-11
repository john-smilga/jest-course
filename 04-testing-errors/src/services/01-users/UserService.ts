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
      throw new Error('User registration failed');
    }
  }
}
