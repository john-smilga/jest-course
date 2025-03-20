import { createHmac } from 'crypto';

export class HashGenerator {
  private hashSalt: string;

  private constructor(hashSalt: string) {
    this.hashSalt = hashSalt;
  }

  static createHashGenerator(hashSalt: string): HashGenerator {
    return new HashGenerator(hashSalt);
  }

  public generateHash(input: string): string {
    return this.makeUrlSafe(
      Buffer.from(
        createHmac('sha256', this.hashSalt).update(input).digest('base64')
      ).toString()
    );
  }

  private makeUrlSafe(str: string): string {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}
