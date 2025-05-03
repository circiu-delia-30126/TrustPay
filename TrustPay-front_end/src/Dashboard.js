import React, { useEffect, useState } from 'react';
import './App.css';

function Dashboard({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [currentTab, setCurrentTab] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`https://localhost:7157/api/Accounts/user/${user.userId}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAccounts(data);
        setCurrentTab(data[0].accountType);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user.userId]);

  const addFunds = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setMessageType('error');
      setMessage("Suma introdusă nu este validă.");
      return;
    }

    try {
      const response = await fetch('https://localhost:7157/api/Transactions/addFunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: selectedAccountId,
          toAccountId: selectedAccountId,
          amount: parsedAmount,
          currency: currency,
          transactionType: "Deposit"
        }),
      });

      if (response.ok) {
        setMessageType('success');
        setMessage('Fondurile au fost adăugate cu succes!');
        await fetchAccounts();
        setShowAddFunds(false);
        setAmount('');
        setCurrency('RON');
      } else {
        const errorData = await response.json();
        setMessageType('error');
        setMessage('Eroare la adăugare: ' + (errorData.message || 'necunoscută'));
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Eroare: ' + error.message);
    }

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const viewTransactions = (accountId) => {
    const trans = transactions[accountId] || [];
    if (trans.length === 0) {
      setMessageType('info');
      setMessage('Nicio tranzacție înregistrată.');
      return;
    }
    alert(
      'Istoricul tranzacțiilor:\n' +
        trans.map((t) => `${t.type} - ${t.amount} ${t.currency}`).join('\n')
    );
  };

  const accountTypes = [...new Set(accounts.map((acc) => acc.accountType))];

  return (
    <div className="app-container">
      <header className="header">
        <h1>TrustPay</h1>
        <div className="header-right">
          <span className="username">Salut, {user.userName}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="tabs">
        {accountTypes.map((type) => (
          <button
            key={type}
            onClick={() => setCurrentTab(type)}
            className={currentTab === type ? 'active' : ''}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {accounts
          .filter((acc) => acc.accountType === currentTab)
          .map((acc) => (
            <div key={acc.accountId} className="account-tab">
              <h3>{acc.accountType}</h3>
              <p>Balanță: {acc.balance} {acc.currency}</p>
              <button
                onClick={() => {
                  setSelectedAccountId(acc.accountId);
                  setShowAddFunds(true);
                }}
              >
                Adaugă Bani
              </button>
              <button onClick={() => viewTransactions(acc.accountId)}>
                Istoric Tranzacții
              </button>
            </div>
          ))}
      </div>

      {showAddFunds && (
        <div className="add-funds-form animated-form">
          <h3>Adăugare Fonduri</h3>
          <div>
            <label>
              Suma:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Introdu suma"
                className="input-field"
              />
            </label>
          </div>
          <div>
            <label>
              Valuta:
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>
          <div className="add-funds-buttons">
            <button className="btn-add" onClick={addFunds}>Adaugă</button>
            <button className="btn-cancel" onClick={() => setShowAddFunds(false)}>Anulează</button>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
