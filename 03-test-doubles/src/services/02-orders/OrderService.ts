// Real Payment Gateway
class PaymentGateway {
  processPayment(amount: number): string {
    return `Processed payment of $${amount}`;
  }
}

// Real Inventory Service
class InventoryService {
  checkStock(productId: string): boolean {
    console.log(productId);
    // In real life, this would check a database
    return true;
  }
}

// Orders Service that depends on PaymentGateway and InventoryService
export class OrderService {
  private paymentGateway: PaymentGateway;
  private inventoryService: InventoryService;

  constructor(
    paymentGateway: PaymentGateway,
    inventoryService: InventoryService
  ) {
    this.paymentGateway = paymentGateway;
    this.inventoryService = inventoryService;
  }

  checkout(amount: number, productId: string): string {
    // First check if product is in stock
    if (!this.inventoryService.checkStock(productId)) {
      return 'Order failed: Product out of stock';
    }

    const paymentResponse = this.paymentGateway.processPayment(amount);
    const bonusPoints = Math.floor(amount / 10);
    return `${paymentResponse} - Earned ${bonusPoints} bonus points!`;
  }
}
