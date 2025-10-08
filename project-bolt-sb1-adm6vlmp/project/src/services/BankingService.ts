import { BankAccount, Transaction, TransferRequest } from '../types/banking';

export class BankingService {
  private accounts: Map<string, BankAccount>;
  private transactions: Transaction[];

  constructor() {
    this.accounts = new Map();
    this.transactions = [];
    this.initializeSampleAccounts();
  }

  private initializeSampleAccounts(): void {
    const sampleAccounts: BankAccount[] = [
      {
        id: '1',
        accountNumber: '1234567890',
        accountHolderName: 'John Doe',
        accountType: 'Checking',
        balance: 5000.00,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        accountNumber: '0987654321',
        accountHolderName: 'Jane Smith',
        accountType: 'Savings',
        balance: 10000.00,
        createdAt: new Date('2024-02-20')
      }
    ];

    sampleAccounts.forEach(account => {
      this.accounts.set(account.accountNumber, account);
    });
  }

  private generateAccountNumber(): string {
    let accountNumber: string;
    do {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    } while (this.accounts.has(accountNumber));
    return accountNumber;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  createAccount(accountHolderName: string, accountType: 'Savings' | 'Checking', initialDeposit: number): BankAccount {
    if (initialDeposit < 0) {
      throw new Error('Initial deposit cannot be negative');
    }

    const account: BankAccount = {
      id: this.generateId(),
      accountNumber: this.generateAccountNumber(),
      accountHolderName,
      accountType,
      balance: initialDeposit,
      createdAt: new Date()
    };

    this.accounts.set(account.accountNumber, account);

    if (initialDeposit > 0) {
      this.addTransaction({
        id: this.generateId(),
        accountId: account.id,
        transactionType: 'Deposit',
        amount: initialDeposit,
        balanceAfter: initialDeposit,
        description: 'Initial deposit',
        createdAt: new Date()
      });
    }

    return account;
  }

  getAccount(accountNumber: string): BankAccount | null {
    return this.accounts.get(accountNumber) || null;
  }

  getAllAccounts(): BankAccount[] {
    return Array.from(this.accounts.values());
  }

  deposit(accountNumber: string, amount: number, description: string = ''): Transaction {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    const account = this.getAccount(accountNumber);
    if (!account) {
      throw new Error('Account not found');
    }

    account.balance += amount;
    this.accounts.set(accountNumber, account);

    const transaction: Transaction = {
      id: this.generateId(),
      accountId: account.id,
      transactionType: 'Deposit',
      amount,
      balanceAfter: account.balance,
      description: description || 'Deposit',
      createdAt: new Date()
    };

    this.addTransaction(transaction);
    return transaction;
  }

  withdraw(accountNumber: string, amount: number, description: string = ''): Transaction {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }

    const account = this.getAccount(accountNumber);
    if (!account) {
      throw new Error('Account not found');
    }

    if (account.balance < amount) {
      throw new Error('Insufficient funds');
    }

    account.balance -= amount;
    this.accounts.set(accountNumber, account);

    const transaction: Transaction = {
      id: this.generateId(),
      accountId: account.id,
      transactionType: 'Withdrawal',
      amount,
      balanceAfter: account.balance,
      description: description || 'Withdrawal',
      createdAt: new Date()
    };

    this.addTransaction(transaction);
    return transaction;
  }

  transfer(request: TransferRequest): { fromTransaction: Transaction; toTransaction: Transaction } {
    if (request.amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }

    if (request.fromAccountNumber === request.toAccountNumber) {
      throw new Error('Cannot transfer to the same account');
    }

    const fromAccount = this.getAccount(request.fromAccountNumber);
    const toAccount = this.getAccount(request.toAccountNumber);

    if (!fromAccount) {
      throw new Error('Source account not found');
    }

    if (!toAccount) {
      throw new Error('Destination account not found');
    }

    if (fromAccount.balance < request.amount) {
      throw new Error('Insufficient funds');
    }

    fromAccount.balance -= request.amount;
    toAccount.balance += request.amount;

    this.accounts.set(request.fromAccountNumber, fromAccount);
    this.accounts.set(request.toAccountNumber, toAccount);

    const fromTransaction: Transaction = {
      id: this.generateId(),
      accountId: fromAccount.id,
      transactionType: 'Transfer',
      amount: request.amount,
      balanceAfter: fromAccount.balance,
      description: `Transfer to ${request.toAccountNumber} - ${request.description}`,
      createdAt: new Date()
    };

    const toTransaction: Transaction = {
      id: this.generateId(),
      accountId: toAccount.id,
      transactionType: 'Transfer',
      amount: request.amount,
      balanceAfter: toAccount.balance,
      description: `Transfer from ${request.fromAccountNumber} - ${request.description}`,
      createdAt: new Date()
    };

    this.addTransaction(fromTransaction);
    this.addTransaction(toTransaction);

    return { fromTransaction, toTransaction };
  }

  private addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  getTransactionHistory(accountNumber: string): Transaction[] {
    const account = this.getAccount(accountNumber);
    if (!account) {
      return [];
    }

    return this.transactions
      .filter(t => t.accountId === account.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getAllTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
