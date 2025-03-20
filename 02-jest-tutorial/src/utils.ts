// Function to add two numbers
export function add(a: number, b: number): number {
  return a + b;
}

// Function to subtract two numbers
export function subtract(a: number, b: number): number {
  return a - b;
}

// Function to check if a number is even
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

// Function that returns an object
export function createUser(
  name: string,
  age: number
): { name: string; age: number } {
  return { name, age };
}

export async function createJwtToken() {
  return 'jwt_token';
}

// Function that would throw an error without the empty array check
export function calculateAverage(arr: number[]): number {
  if (arr.length === 0) return 0;

  const sum = arr.reduce((total, num) => total + num);
  return sum / arr.length;
}
