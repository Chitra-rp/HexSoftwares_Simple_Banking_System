export interface BankAccount {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: 'Savings' | 'Checking';
  balance: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  transactionType: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: Date;
}

export interface TransferRequest {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description: string;
}
