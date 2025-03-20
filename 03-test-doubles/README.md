# Test Doubles

A "Test Double" is a general term in testing that comes from the concept of a "stunt double" in movies - just like how a stunt double stands in for an actor in difficult scenes, a test double stands in for a real dependency or component in tests.

Test doubles can replace:

- Functions
- Classes
- Modules
- Services
- APIs
- Database connections
- External systems
- Entire subsystems
- Any other dependency

Here’s a list of possible test doubles:

1. Dummy
2. Stub
3. Fake
4. Mock
5. Spy

## Dummy Test Double

A dummy is a test double used to fill a parameter or type requirement in a test, providing only what is necessary to make the test compile and run. It usually has no meaningful behavior or interactions within the test, serving simply as a placeholder.

- explore `src/services/01-books/BookService.ts`
- create a test file `bookService.spec.ts` in the same directory, and test `getBookDisplayTitle` function

bookService.spec.ts

```ts
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
```

## Stub and Fake Test Double

A **stub** is a simple test double that gives predefined responses to method calls, helping control the flow of a test without implementing full behavior. It just returns fixed values or minimal functionality needed for the test. A **fake**, on the other hand, provides a more complete, working implementation of a component, but it's simpler than the real version. While both stubs and fakes are used to simulate parts of a system in tests, they often overlap in their use, and the terms are sometimes used interchangeably. However, the key difference is that a stub generally offers less behavior, focusing only on returning specific values, while a fake mimics real behavior more fully.

- explore `src/services/02-orders/OrderService.ts`
- create a test file `orderService.spec.ts` and test `OrderService.checkout` functionality

orderService.spec.ts

```ts
import { OrderService } from './OrderService';

// Stub Inventory Service
class InventoryServiceStub {
  private inStock: boolean = true;
  // extra method to change the stock status
  setInStock(value: boolean) {
    this.inStock = value;
  }

  checkStock(_productId: string): boolean {
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
```

In our OrderService example, we can clearly see the differences between Stubs and Fakes:

A **Stub** is a simplified test double that provides pre-programmed responses to calls. Like our `InventoryServiceStub`, it doesn't have any real logic - it just returns whatever boolean value we set via `setInStock`. Stubs are used when we want to control the indirect inputs to our test and don't care about the actual implementation.

A **Fake** is a working implementation with real logic, but simplified for testing. Our `FakePaymentGateway` demonstrates this - it has actual working behavior (tracks transactions in memory, formats response strings) but uses a simplified approach (in-memory array) instead of making real API calls like a production payment gateway would. Fakes are useful when we need more sophisticated behavior than a stub but want to avoid the complexity or external dependencies of the real implementation.

The key difference is that stubs are just responders (return what we tell them to), while fakes have actual working logic (but simplified for testing).

## Refactor

An alternative to `console.log()` specifically for tests, as it is already being used in the actual code.

```ts
 checkStock(_productId: string): boolean {
    return this.inStock;
  }
```

```ts
import { OrderService } from './OrderService';

// Stub Inventory Service
class InventoryServiceStub {
  private inStock: boolean = true;

  setInStock(value: boolean) {
    this.inStock = value;
  }

  checkStock(_productId: string): boolean {
    return this.inStock;
  }
}
type Transaction = { amount: number; status: string };

// Fake Payment Gateway for testing
class FakePaymentGateway {
  private transactions: Transaction[] = [];

  processPayment(amount: number): string {
    this.transactions.push({ amount, status: 'success' });
    return `Processed payment of $${amount}`;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }
}

describe('OrderService', () => {
  let fakePaymentGateway: FakePaymentGateway;
  let inventoryStub: InventoryServiceStub;
  let orderService: OrderService;
  let amount: number;
  let productId: string;

  beforeEach(() => {
    fakePaymentGateway = new FakePaymentGateway();
    inventoryStub = new InventoryServiceStub();
    orderService = new OrderService(fakePaymentGateway, inventoryStub);
    amount = 100; // Default amount for tests
    productId = 'PROD123'; // Default product ID for tests
  });

  test('processes payment and calculates bonus points correctly when in stock', () => {
    const result = orderService.checkout(amount, productId);

    expect(result).toBe('Processed payment of $100 - Earned 10 bonus points!');
    expect(fakePaymentGateway.getTransactions()).toEqual([
      { amount, status: 'success' },
    ]);
  });

  test('fails order when product is out of stock', () => {
    inventoryStub.setInStock(false);

    const result = orderService.checkout(amount, productId);

    expect(result).toBe('Order failed: Product out of stock');
    expect(fakePaymentGateway.getTransactions()).toEqual([]); // No payment should be processed
  });

  test('handles decimal amounts correctly for bonus points', () => {
    amount = 55.99; // Override default amount for this test

    const result = orderService.checkout(amount, productId);

    expect(result).toBe('Processed payment of $55.99 - Earned 5 bonus points!');
    expect(fakePaymentGateway.getTransactions()).toEqual([
      { amount, status: 'success' },
    ]);
  });
});
```

## Spies and Mocks

Let's cover Spies first, as they are generally more versatile and easier to understand. Spies and Mocks are very similar in nature, so their use cases and terminology often overlap in testing

**Spies** in Jest are test doubles that can both track function calls AND optionally modify their behavior. They're versatile testing tools that can:

**Track function calls** (observation mode):

- If a function was called
- How many times it was called
- What arguments were passed

**Modify behavior** (intervention mode):

- Return custom values
- Implement fake behavior
- Throw errors

Here's an example showing both capabilities:

```ts
const user = {
  saveProfile: (name: string) => {
    return `saved-${name}`;
  },

  getRole: (userId: number) => {
    if (userId > 10) {
      return 'guest';
    }
    return 'admin';
  },

  fetchUserData: async (userId: number) => {
    // imagine this calls an API
    return { id: userId, name: 'John' };
  },
};
```

**jest.spyOn**

```ts
describe('Spy mocking examples', () => {
  it('uses mockReturnValue for sync functions', () => {
    jest.spyOn(user, 'getRole').mockReturnValue('guest');

    // since we mocked the function, it will return the mocked value
    const result = user.getRole(9);
    expect(result).toBe('guest');
  });

  it('uses mockResolvedValue for async functions', async () => {
    jest
      .spyOn(user, 'fetchUserData')
      .mockResolvedValue({ id: 444, name: 'Mocked User' });

    const result = await user.fetchUserData(34);
    expect(result).toEqual({ id: 444, name: 'Mocked User' });
  });

  it('uses mockImplementation for complex logic', () => {
    jest.spyOn(user, 'saveProfile').mockImplementation((name: string) => {
      if (!name) {
        throw new Error('Name required');
      }
      return `saved-${name}`;
    });

    expect(() => user.saveProfile('')).toThrow('Name required');
  });
});
```

### Jest SpyOn

`jest.spyOn` is a Jest utility function that creates a spy for any object's method. It takes two arguments:

- **First argument**: The object containing the method (`user` in our example)
- **Second argument**: The name of the method to spy on (as a string, like `'getRole'`)

`jest.spyOn` by default keeps the original implementation of the method but starts tracking all calls to it. It returns a Jest mock function that you can:

- Use to verify calls (`spy.toHaveBeenCalled()`)
- Chain with mock methods (`.mockReturnValue()`, `.mockImplementation()`, etc.)

### Jest Spy Methods

- **mockReturnValue**: Simplest way to make a spy return a specific value. Perfect for synchronous functions when you just need a static return value.

```ts
mockReturnValue('guest');
```

- **mockResolvedValue**: Specifically designed for async functions, it automatically wraps your value in a resolved Promise. Cleaner than writing `.mockReturnValue(Promise.resolve(...))`.

```ts
mockResolvedValue({ id: 123 });
```

- **mockImplementation**: Most flexible option that lets you provide a complete custom implementation. Use this when you need conditional logic, multiple return values, or to throw errors based on inputs.

```ts
mockImplementation((data) => {
  if (!data) throw new Error();
  return 'valid';
});
```

### Clear Mocks

**mockClear() / jest.clearAllMocks()**

- Clears tracking of calls and instances
- Keeps mock implementations
- Use when you just want to reset call counts

**mockReset() / jest.resetAllMocks()**

- Does everything mockClear() does
- Also removes mock implementations
- Use when you want to reset everything about the mock but keep it as a mock

**mockRestore() / jest.restoreAllMocks()**

- Does everything mockReset() does
- Also restores original implementation
- Use when you want to completely undo the mocking
- Most common use case is mockRestore() in afterEach to ensure tests start fresh with original implementations

```ts
const user = {
  getRole: (userId: number) => {
    if (userId > 10) {
      return 'guest';
    }
    return 'admin';
  },
};

describe('User role tests', () => {
  let roleSpy: jest.SpyInstance;

  beforeEach(() => {
    roleSpy = jest.spyOn(user, 'getRole');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return mocked guest role', () => {
    roleSpy.mockReturnValue('guest');
    const result = user.getRole(2);
    expect(result).toBe('guest');
  });

  it('should return original implementation', () => {
    // Without creating a new mock, just using original behavior
    const result = user.getRole(2);
    expect(result).toBe('admin');
    // Verify the function was called exactly the number of times we expect during the test

    expect(roleSpy).toHaveBeenCalledTimes(1);
  });
});
```

### UserService

Review the following files in the users module:

- `src/services/03-users/UserService.ts`
- `src/services/03-users/DatabaseService.ts`
- `src/services/03-users/NewsletterService.ts`

You can verify the logic by running the command `npm run dev`
Create a test file and mock external API calls using the spyOn method

userService.spec.ts

```ts
// userService.spec.ts
import { UserService } from './UserService';
import { NewsletterService } from './NewsletterService';
import { DatabaseService } from './DatabaseService';

describe('UserService', () => {
  const successResponse = { msg: 'user registered successfully' };
  const errorResponse = { msg: 'failed to register user' };

  const mockName = 'John Doe';
  const mockEmail = 'test@test.com';
  const mockUser = {
    id: 1,
    name: mockName,
    email: mockEmail,
    role: 'user',
  };

  // test('should successfully register user and return success message', async () => {
  //   const userService = new UserService(mockName, mockEmail);
  //   const result = await userService.registerUser();
  //   expect(result).toEqual(successResponse);
  // });

  let createUserSpy: jest.SpyInstance;
  let subscribeUserSpy: jest.SpyInstance;

  beforeEach(() => {
    createUserSpy = jest.spyOn(DatabaseService, 'createUser');
    subscribeUserSpy = jest.spyOn(NewsletterService, 'subscribeUser');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully register user and return success message', async () => {
    const userService = new UserService(mockName, mockEmail);
    createUserSpy.mockResolvedValue(mockUser);
    subscribeUserSpy.mockResolvedValue({ msg: 'success' });
    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(mockName, mockEmail);
    expect(subscribeUserSpy).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(successResponse);
  });

  it('should return error message if name is not provided', async () => {
    const invalidInput = { name: '', email: mockEmail };
    const userService = new UserService(invalidInput.name, invalidInput.email);

    createUserSpy.mockImplementation(() => {
      return Promise.reject('Name is required');
    });

    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(
      invalidInput.name,
      invalidInput.email
    );
    expect(subscribeUserSpy).not.toHaveBeenCalled();
    expect(result).toEqual(errorResponse);
  });
  it('should return error message if email value is not test@test.com', async () => {
    const invalidInput = { name: mockName, email: 'invalid@email.com' };
    const invalidUser = {
      id: 1,
      name: invalidInput.name,
      email: invalidInput.email,
      role: 'user',
    };
    const userService = new UserService(invalidInput.name, invalidInput.email);

    createUserSpy.mockResolvedValue(invalidUser);
    subscribeUserSpy.mockImplementation(() => {
      return Promise.reject('Email is not valid');
    });

    const result = await userService.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith(
      invalidInput.name,
      invalidInput.email
    );
    expect(subscribeUserSpy).toHaveBeenCalledWith(invalidUser);
    expect(result).toEqual(errorResponse);
  });
});
```

## Mocks

Jest mocks are test replacements that let you override modules or objects with fake versions. They're more aggressive than spies because they replace everything in the target module/object. When using jest.fn() to create mocks, you get additional benefits like tracking function calls, arguments, and the ability to use Jest matchers. While it's commonly mentioned that jest.mock() must come before imports, Jest actually hoists these calls automatically, so both orders work.

Note: When mocking an entire module, be careful as you need to mock all methods you plan to use in your tests, otherwise they will be undefined.

`src/services/03-users/user.ts`

```ts
export const user = {
  getRole: (): string => 'admin',
  getName: (): string => 'John',
  getEmail: (): string => 'john@example.com',
};
```

## Mock Flavors in Jest

Jest provides several ways to create and use mocks

services/03-users/user.spec.ts

```ts
import { user } from './user';

describe('User mocking approaches', () => {
  it('mocks single method using jest.fn()', () => {
    // Direct assignment of mock function
    user.getRole = jest.fn().mockReturnValue('guest');

    expect(user.getRole()).toBe('guest'); // ✅ Works
    // coming from the original implementation
    expect(user.getName()).toBe('John'); // ✅ Works
    expect(user.getEmail()).toBe('john@example.com'); // ✅ Works
  });
});
```

`jest.mock()` is a powerful function that replaces an entire module with a mock version, allowing you to control its behavior in tests. It takes two arguments:

1. The path to the module you want to mock
2. An optional factory function that returns your custom mock implementation

```ts
import { user } from './user';

jest.mock('./user');

// Result:
// {
//   user: {
//     getRole: jest.fn(), // returns undefined
//     getName: jest.fn(), // returns undefined
//     getEmail: jest.fn() // returns undefined
//   }
// }
console.log(user);
describe('User mocking approaches', () => {
  it('mocks single method using jest.fn()', () => {
    // make typescript happy
    (user.getRole as jest.Mock).mockReturnValue('guest');

    expect(user.getRole()).toBe('guest');
    // this will fail because it's now undefined
    // expect(user.getName()).toBe('John');
  });
});
```

When using `jest.mock()`, the factory function in the second argument completely replaces the original module with a mock object, so all methods not explicitly defined in the mock will be undefined and the mock structure must match the original module.

Example:

```ts
import { myModule } from './myModule';

// Basic usage - all exports become jest.fn()
jest.mock('./myModule');

// With custom implementation
jest.mock('./myModule', () => ({
  someFunction: jest.fn().mockReturnValue('mocked'),
  someValue: 'mock value',
}));
```

```ts
import { user } from './user';

jest.mock('./user', () => ({
  user: {
    getRole: jest.fn().mockReturnValue('guest'),
  },
}));

describe('User mocking', () => {
  it('shows mock gotcha', () => {
    // This works because we mocked it
    expect(user.getRole()).toBe('guest');

    // These will fail with "user.getName is not a function"
    // because our mock didn't include these methods
    expect(user.getName()).toBe('John'); // ❌ Error!
  });
});
```

```ts
import { user } from './user';
jest.mock('./user', () => ({
  user: {
    getRole: jest.fn().mockReturnValue('guest'),
    getName: jest.fn().mockReturnValue('peter'),
    // we can also to this :
    getEmail: (): string => 'john@example.com',
    // but it won't have all of the mock benefits (tracking calls, args, etc)
  },
}));

describe('User mocking', () => {
  it('shows mock gotcha', () => {
    expect(user.getRole()).toBe('guest');
    expect(user.getName()).toBe('peter');
    expect(user.getEmail()).toBe('john@example.com');
    // will fail because we didn't mock the getEmail method
    expect(user.getEmail).toHaveBeenCalled();
  });
});
```

# Working with External Modules in Jest

Jest allows us to mock and spy on both built-in Node.js modules and third-party modules (like `console`, `axios`, etc.), and in this example, we'll explore how to do this with the built-in `fs` (File System) module.

```ts
import fs from 'fs';

jest.mock('fs');

describe('File System with Mock', () => {
  it('should mock file reading', () => {
    const mockContent = 'file content';
    // make typescript happy
    (fs.readFileSync as jest.Mock).mockReturnValue(mockContent);

    const content = fs.readFileSync('test.txt', 'utf-8');
    expect(content).toBe(mockContent);
  });
});
```

```ts
import fs from 'fs';

describe('File System with Spy', () => {
  it('should spy on file reading', () => {
    const mockContent = 'file content';
    const spy = jest.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

    const content = fs.readFileSync('test.txt', 'utf-8');

    expect(content).toBe(mockContent);
    expect(spy).toHaveBeenCalledWith('test.txt', 'utf-8');

    // Restore original implementation
    spy.mockRestore();
  });
});
```
