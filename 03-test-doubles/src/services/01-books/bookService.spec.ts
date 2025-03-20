import { getBookDisplayTitle } from './BookService';

describe('getBookDisplayTitle', () => {
  it('should format book title correctly', () => {
    const dummyBook = {
      title: 'Deep Work',
      author: 'Cal Newport',
    } as any;

    const result = getBookDisplayTitle(dummyBook);
    expect(result).toBe('Deep Work by Cal Newport');
  });
});
