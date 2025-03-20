export default class Calculator {
  value: number;

  constructor() {
    this.value = 0;
  }

  add(num: number): number {
    this.value += num;
    return this.value;
  }

  subtract(num: number): number {
    this.value -= num;
    return this.value;
  }

  isPositive(): boolean {
    return this.value > 0;
  }
}
