import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo1.png';

// Stiluri inline pentru noul design
const styles = {
  chromeTabsContainer: {
    backgroundColor: '#f0f3f5',
    padding: '0 20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    marginBottom: '20px'
  },
  chromeTab: {
    background: 'transparent',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    padding: '14px 28px',
    margin: '0 6px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#5f6368',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    marginBottom: '-1px'
  },
  chromeTabActive: {
    background: '#fff',
    color: '#1a73e8',
    borderTop: '2px solid #1a73e8',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
  },
  accountTab: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    padding: '30px',
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  accountInfo: {
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  balanceLabel: {
    fontSize: '18px',
    color: '#5f6368',
    margin: '0 0 5px 0'
  },
  accountTitle: {
    fontSize: '20px',
    margin: '0 0 8px 0',
    color: '#202124',
    display: 'none' // Ascundem titlul - va fi doar în tab
  },
  accountBalance: {
    fontSize: '32px',
    fontWeight: '500',
    color: '#202124',
    margin: '5px 0'
  },
  accountActions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '30px'
  },
  actionButton: {
    padding: '16px 32px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '180px'
  },
  transferButton: {
    backgroundColor: '#1a73e8',
    color: 'white'
  },
  historyButton: {
    backgroundColor: '#f1f3f4',
    color: '#5f6368'
  },
  headerLogo: {
    width: '50px',  // Mărim logo-ul
    height: 'auto'
  }
};

function Dashboard({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [currentTab, setCurrentTab] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [fromAccountId, setFromAccountId] = useState(null);
  const [toAccountId, setToAccountId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState('RON');
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



  const transferFunds = async () => {
    const parsedAmount = parseFloat(transferAmount);
    if (!parsedAmount || parsedAmount <= 0) {
      setMessageType('error');
      setMessage("Suma introdusă nu este validă.");
      return;
    }

    if (fromAccountId === toAccountId) {
      setMessageType('error');
      setMessage("Nu poți transfera către același cont.");
      return;
    }

    try {
      const response = await fetch('https://localhost:7157/api/Transactions/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId,
          toAccountId,
          amount: parsedAmount,
          currency: transferCurrency,
          transactionType: "Transfer"
        }),
      });

      if (response.ok) {
        setMessageType('success');
        setMessage("Transfer realizat cu succes!");
        await fetchAccounts();
        setShowTransferForm(false);
        setTransferAmount('');
        setTransferCurrency('RON');
      } else {
        const errorData = await response.json();
        setMessageType('error');
        setMessage("Eroare la transfer: " + (errorData.message || "necunoscută"));
      }
    } catch (error) {
      setMessageType('error');
      setMessage("Eroare: " + error.message);
    }

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const fetchTransactions = async (accountId) => {
    try {
      const response = await fetch(`https://localhost:7157/api/Transactions/account/${accountId}`);
      if (!response.ok) {
        throw new Error("Nu s-au putut prelua tranzacțiile.");
      }

      const data = await response.json();
      setTransactions((prev) => ({ ...prev, [accountId]: data }));
    } catch (error) {
      console.error("Eroare la preluarea tranzacțiilor:", error);
      setMessageType("error");
      setMessage("Eroare la preluarea tranzacțiilor.");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 4000);
    }
  };

  const viewTransactions = async (accountId) => {
    await fetchTransactions(accountId);
    const trans = transactions[accountId] || [];

    if (trans.length === 0) {
      setMessageType("info");
      setMessage("Nicio tranzacție înregistrată.");
      return;
    }

    const formatted = trans.map((t) =>
      `→ De la contul ${t.fromAccountId} către ${t.toAccountId} — ${t.amount} ${t.currency} (${new Date(t.transactionDate).toLocaleString()})`
    );

    alert("Istoric tranzacții:\n\n" + formatted.join("\n"));
  };

  const accountTypes = [...new Set(accounts.map((acc) => acc.accountType))];

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="TrustPay Logo" style={styles.headerLogo} />
          {/* Am eliminat textul TrustPay de lângă logo */}
        </div>
        <div className="header-right">
          <span className="username">Salut, {user.userName}!</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.chromeTabsContainer}>
        {accountTypes.map((type) => (
          <button
            key={type}
            onClick={() => setCurrentTab(type)}
            style={{
              ...styles.chromeTab,
              ...(currentTab === type ? styles.chromeTabActive : {})
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {accounts
          .filter((acc) => acc.accountType === currentTab)
          .map((acc) => (
            <div key={acc.accountId} style={styles.accountTab}>
              <div style={styles.accountInfo}>
                <h3 style={styles.accountTitle}>{acc.accountType}</h3>
                <div style={styles.balanceLabel}>Balanță:</div>
                <p style={styles.accountBalance}>{acc.balance} {acc.currency}</p>
              </div>
              <div style={styles.accountActions}>
                <button 
                  style={{...styles.actionButton, ...styles.transferButton}}
                  onClick={() => {
                    setFromAccountId(acc.accountId);
                    setShowTransferForm(true);
                  }}
                >
                  Mutare fonduri
                </button>
                <button 
                  style={{...styles.actionButton, ...styles.historyButton}}
                  onClick={() => viewTransactions(acc.accountId)}
                >
                  Istoric Tranzacții
                </button>
              </div>
            </div>
          ))}
      </div>

      {showTransferForm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          width: '90%',
          maxWidth: '500px',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <h3 style={{
            fontSize: '20px',
            marginTop: 0,
            marginBottom: '24px',
            color: '#202124'
          }}>Mutare fonduri</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', color: '#5f6368' }}>
              Către cont:
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  marginTop: '6px',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px'
                }}
              >
                <option value="">Selectează</option>
                {accounts
                  .filter((acc) => acc.accountId !== fromAccountId)
                  .map((acc) => (
                    <option key={acc.accountId} value={acc.accountId}>
                      {acc.accountType} ({acc.currency})
                    </option>
                  ))}
              </select>
            </label>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', color: '#5f6368' }}>
              Suma:
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Introdu suma"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  marginTop: '6px',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px'
                }}
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', color: '#5f6368' }}>
              Valuta:
              <select
                value={transferCurrency}
                onChange={(e) => setTransferCurrency(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  marginTop: '6px',
                  borderRadius: '8px',
                  border: '1px solid #dadce0',
                  fontSize: '16px'
                }}
              >
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#f1f3f4',
                color: '#5f6368',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={() => setShowTransferForm(false)}
            >
              Anulează
            </button>
            <button 
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#1a73e8',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={transferFunds}
            >
              Transferă
            </button>
          </div>

          {message && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: messageType === 'success' ? '#e6f4ea' : messageType === 'error' ? '#fce8e6' : '#e8f0fe',
              color: messageType === 'success' ? '#137333' : messageType === 'error' ? '#c5221f' : '#1967d2',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;