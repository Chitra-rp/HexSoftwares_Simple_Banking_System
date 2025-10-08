import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, X } from 'lucide-react';
import { BankAccount } from '../types/banking';

interface TransactionFormProps {
  accounts: BankAccount[];
  selectedAccount: BankAccount | null;
  onDeposit: (accountNumber: string, amount: number, description: string) => void;
  onWithdraw: (accountNumber: string, amount: number, description: string) => void;
  onTransfer: (fromAccountNumber: string, toAccountNumber: string, amount: number, description: string) => void;
  onClose: () => void;
}

export function TransactionForm({
  accounts,
  selectedAccount,
  onDeposit,
  onWithdraw,
  onTransfer,
  onClose
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fromAccount, setFromAccount] = useState(selectedAccount?.accountNumber || '');
  const [toAccount, setToAccount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      if (transactionType === 'deposit') {
        if (!fromAccount) {
          setError('Please select an account');
          return;
        }
        onDeposit(fromAccount, amountNum, description);
        setSuccess('Deposit successful!');
      } else if (transactionType === 'withdraw') {
        if (!fromAccount) {
          setError('Please select an account');
          return;
        }
        onWithdraw(fromAccount, amountNum, description);
        setSuccess('Withdrawal successful!');
      } else {
        if (!fromAccount || !toAccount) {
          setError('Please select both accounts');
          return;
        }
        if (fromAccount === toAccount) {
          setError('Cannot transfer to the same account');
          return;
        }
        onTransfer(fromAccount, toAccount, amountNum, description);
        setSuccess('Transfer successful!');
      }

      setAmount('');
      setDescription('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionType('deposit')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    transactionType === 'deposit'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ArrowDownCircle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Deposit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('withdraw')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    transactionType === 'withdraw'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ArrowUpCircle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Withdraw</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('transfer')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    transactionType === 'transfer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ArrowLeftRight className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Transfer</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700 mb-2">
                {transactionType === 'transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                id="fromAccount"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.accountNumber} value={account.accountNumber}>
                    {account.accountNumber} - {account.accountHolderName} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {transactionType === 'transfer' && (
              <div>
                <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700 mb-2">
                  To Account
                </label>
                <select
                  id="toAccount"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter((account) => account.accountNumber !== fromAccount)
                    .map((account) => (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        {account.accountNumber} - {account.accountHolderName}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Optional description"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
