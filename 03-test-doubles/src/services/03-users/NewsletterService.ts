const newsletterUrl = 'https://www.course-api.com/jest-course/newsletter';

import { type User } from './DatabaseService';

export class NewsletterService {
  static async subscribeUser(user: User): Promise<{ msg: string }> {
    const response = await fetch(newsletterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const data = (await response.json()) as { msg: string };
    console.log('NewsletterService API Response : ', data);
    return data;
  }
}
