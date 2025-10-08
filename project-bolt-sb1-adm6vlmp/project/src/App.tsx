import { useState, useEffect } from 'react';
import { BankingService } from './services/BankingService';
import { BankAccount, Transaction } from './types/banking';
import { AccountCard } from './components/AccountCard';
import { TransactionList } from './components/TransactionList';
import { CreateAccountForm } from './components/CreateAccountForm';
import { TransactionForm } from './components/TransactionForm';
import { Building2, Plus, ArrowRightLeft, History, Users } from 'lucide-react';

function App() {
  const [bankingService] = useState(() => new BankingService());
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [view, setView] = useState<'accounts' | 'history'>('accounts');

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);

  const loadAccounts = () => {
    const allAccounts = bankingService.getAllAccounts();
    setAccounts(allAccounts);
  };

  const loadTransactions = () => {
    if (selectedAccount) {
      const accountTransactions = bankingService.getTransactionHistory(selectedAccount.accountNumber);
      setTransactions(accountTransactions);
    } else {
      const allTransactions = bankingService.getAllTransactions();
      setTransactions(allTransactions);
    }
  };

  const handleCreateAccount = (name: string, type: 'Savings' | 'Checking', initialDeposit: number) => {
    bankingService.createAccount(name, type, initialDeposit);
    loadAccounts();
    loadTransactions();
  };

  const handleDeposit = (accountNumber: string, amount: number, description: string) => {
    bankingService.deposit(accountNumber, amount, description);
    loadAccounts();
    loadTransactions();
    updateSelectedAccount(accountNumber);
  };

  const handleWithdraw = (accountNumber: string, amount: number, description: string) => {
    bankingService.withdraw(accountNumber, amount, description);
    loadAccounts();
    loadTransactions();
    updateSelectedAccount(accountNumber);
  };

  const handleTransfer = (fromAccountNumber: string, toAccountNumber: string, amount: number, description: string) => {
    bankingService.transfer({ fromAccountNumber, toAccountNumber, amount, description });
    loadAccounts();
    loadTransactions();
    updateSelectedAccount(fromAccountNumber);
  };

  const updateSelectedAccount = (accountNumber: string) => {
    const updatedAccount = bankingService.getAccount(accountNumber);
    if (updatedAccount) {
      setSelectedAccount(updatedAccount);
    }
  };

  const handleSelectAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    const accountTransactions = bankingService.getTransactionHistory(account.accountNumber);
    setTransactions(accountTransactions);
  };

  const handleClearSelection = () => {
    setSelectedAccount(null);
    loadTransactions();
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Java Banking System</h1>
                <p className="text-sm text-gray-500">Demonstrating Object-Oriented Programming Concepts</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                ${getTotalBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('accounts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                view === 'accounts'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Accounts</span>
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                view === 'history'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Transaction History</span>
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateAccount(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Account</span>
            </button>
            <button
              onClick={() => setShowTransaction(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>New Transaction</span>
            </button>
          </div>
        </div>

        {view === 'accounts' ? (
          <div>
            {selectedAccount && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Viewing transactions for:</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {selectedAccount.accountHolderName} - {selectedAccount.accountNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleClearSelection}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    View All Transactions
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {accounts.map((account) => (
                <AccountCard
                  key={account.accountNumber}
                  account={account}
                  onSelect={handleSelectAccount}
                  isSelected={selectedAccount?.accountNumber === account.accountNumber}
                />
              ))}
            </div>

            {accounts.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
                <p className="text-gray-500 mb-4">Create your first bank account to get started</p>
                <button
                  onClick={() => setShowCreateAccount(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {accounts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedAccount ? 'Account Transactions' : 'Recent Transactions'}
                </h2>
                <TransactionList transactions={transactions} />
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Transactions</h2>
            <TransactionList transactions={transactions} />
          </div>
        )}
      </div>

      {showCreateAccount && (
        <CreateAccountForm
          onCreateAccount={handleCreateAccount}
          onClose={() => setShowCreateAccount(false)}
        />
      )}

      {showTransaction && (
        <TransactionForm
          accounts={accounts}
          selectedAccount={selectedAccount}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onTransfer={handleTransfer}
          onClose={() => setShowTransaction(false)}
        />
      )}
    </div>
  );
}

export default App;
