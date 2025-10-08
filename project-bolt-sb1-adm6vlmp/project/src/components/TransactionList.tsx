import { Transaction } from '../types/banking';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  accountNumber?: string;
}

export function TransactionList({ transactions, accountNumber }: TransactionListProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
      case 'Withdrawal':
        return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
      case 'Transfer':
        return <ArrowLeftRight className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getAmountColor = (type: string, description: string) => {
    if (type === 'Transfer') {
      return description.includes('from') ? 'text-green-600' : 'text-red-600';
    }
    return type === 'Deposit' ? 'text-green-600' : 'text-red-600';
  };

  const getAmountPrefix = (type: string, description: string) => {
    if (type === 'Transfer') {
      return description.includes('from') ? '+' : '-';
    }
    return type === 'Deposit' ? '+' : '-';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="mt-1">{getTransactionIcon(transaction.transactionType)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900">{transaction.transactionType}</p>
                  <p className={`font-bold text-lg ${getAmountColor(transaction.transactionType, transaction.description)}`}>
                    {getAmountPrefix(transaction.transactionType, transaction.description)}
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-2 break-words">{transaction.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{transaction.createdAt.toLocaleString()}</span>
                  <span className="font-medium">
                    Balance: ${transaction.balanceAfter.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
