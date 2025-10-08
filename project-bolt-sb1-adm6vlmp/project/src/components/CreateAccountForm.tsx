import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

interface CreateAccountFormProps {
  onCreateAccount: (name: string, type: 'Savings' | 'Checking', initialDeposit: number) => void;
  onClose: () => void;
}

export function CreateAccountForm({ onCreateAccount, onClose }: CreateAccountFormProps) {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'Savings' | 'Checking'>('Checking');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter account holder name');
      return;
    }

    const deposit = parseFloat(initialDeposit) || 0;
    if (deposit < 0) {
      setError('Initial deposit cannot be negative');
      return;
    }

    try {
      onCreateAccount(name.trim(), accountType, deposit);
      setName('');
      setInitialDeposit('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Account</h2>
          </div>
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

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('Checking')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    accountType === 'Checking'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Checking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('Savings')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    accountType === 'Savings'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Savings</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 mb-2">
                Initial Deposit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="initialDeposit"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
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
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
