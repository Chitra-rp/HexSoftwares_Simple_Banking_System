import { BankAccount } from '../types/banking';
import { CreditCard, Calendar } from 'lucide-react';

interface AccountCardProps {
  account: BankAccount;
  onSelect: (account: BankAccount) => void;
  isSelected: boolean;
}

export function AccountCard({ account, onSelect, isSelected }: AccountCardProps) {
  return (
    <div
      onClick={() => onSelect(account)}
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${account.accountType === 'Savings' ? 'bg-green-100' : 'bg-blue-100'}`}>
            <CreditCard className={`w-6 h-6 ${account.accountType === 'Savings' ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.accountHolderName}</h3>
            <p className="text-sm text-gray-500">{account.accountType} Account</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Account Number</p>
        <p className="font-mono text-lg text-gray-900">{account.accountNumber}</p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500 mb-1">Balance</p>
        <p className="text-2xl font-bold text-gray-900">
          ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex items-center text-xs text-gray-400 pt-3 border-t border-gray-100">
        <Calendar className="w-3 h-3 mr-1" />
        <span>Created: {account.createdAt.toLocaleDateString()}</span>
      </div>
    </div>
  );
}
