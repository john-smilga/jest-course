import { OrderService } from './OrderService';

// Stub Inventory Service
class InventoryServiceStub {
  private inStock: boolean = true;
  // extra method to change the stock status
  setInStock(value: boolean) {
    this.inStock = value;
  }

  checkStock(productId: string): boolean {
    return this.inStock;
  }
}

// Fake Payment Gateway for testing
class FakePaymentGateway {
  private transactions: { amount: number; status: string }[] = [];

  processPayment(amount: number): string {
    this.transactions.push({ amount, status: 'success' });
    return `Processed payment of $${amount}`;
  }

  getTransactions(): { amount: number; status: string }[] {
    return this.transactions;
  }
}

describe('OrderService', () => {
  test('processes payment and calculates bonus points correctly when in stock', () => {
    const fakePaymentGateway = new FakePaymentGateway();
    const inventoryStub = new InventoryServiceStub();
    const orderService = new OrderService(fakePaymentGateway, inventoryStub);

    const result = orderService.checkout(100, 'PROD123');

    expect(result).toBe('Processed payment of $100 - Earned 10 bonus points!');
    expect(fakePaymentGateway.getTransactions()).toEqual([
      { amount: 100, status: 'success' },
    ]);
  });

  test('fails order when product is out of stock', () => {
    const fakePaymentGateway = new FakePaymentGateway();
    const inventoryStub = new InventoryServiceStub();
    inventoryStub.setInStock(false);
    const orderService = new OrderService(fakePaymentGateway, inventoryStub);

    const result = orderService.checkout(100, 'PROD123');

    expect(result).toBe('Order failed: Product out of stock');
    expect(fakePaymentGateway.getTransactions()).toEqual([]); // No payment should be processed
  });

  test('handles decimal amounts correctly for bonus points', () => {
    const fakePaymentGateway = new FakePaymentGateway();
    const inventoryStub = new InventoryServiceStub();
    const orderService = new OrderService(fakePaymentGateway, inventoryStub);

    const result = orderService.checkout(55.99, 'PROD123');

    expect(result).toBe('Processed payment of $55.99 - Earned 5 bonus points!');
    expect(fakePaymentGateway.getTransactions()).toEqual([
      { amount: 55.99, status: 'success' },
    ]);
  });
});
