import { sum } from '../sum';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    const result = sum(-1, -2);
    expect(result).toBe(-3);
  });
});
