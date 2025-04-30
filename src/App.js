import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Starea de logare
  const [currentTab, setCurrentTab] = useState('current'); // Tab-ul selectat
  const [balance, setBalance] = useState(0); // Balanța de pe contul curent
  const [transactions, setTransactions] = useState([]); // Istoricul tranzacțiilor

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const addFunds = () => {
    const amount = parseFloat(prompt("Introduceți suma de adăugat:"));
    if (amount && amount > 0) {
      setBalance(balance + amount);
      setTransactions([...transactions, { type: 'Depunere', amount }]);
    }
  };

  const viewTransactions = () => {
    alert("Istoricul tranzacțiilor: " + transactions.map(t => `${t.type} - ${t.amount} RON`).join(', '));
  };

  // Pagina de login
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h1>TrustPay</h1>
        <h2>Enter your account</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>TrustPay</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="tabs">
        <button onClick={() => setCurrentTab('current')} className={currentTab === 'current' ? 'active' : ''}>Cont Curent</button>
        <button onClick={() => setCurrentTab('savings')} className={currentTab === 'savings' ? 'active' : ''}>Economii</button>
        <button onClick={() => setCurrentTab('investments')} className={currentTab === 'investments' ? 'active' : ''}>Investiții</button>
      </div>

      <div className="tab-content">
        {currentTab === 'current' && (
          <div className="current-tab">
            <h3>Cont Curent</h3>
            <p>Balanta: {balance} RON</p>
            <button onClick={addFunds}>Adaugă Bani</button>
            <button onClick={viewTransactions}>Istoric Tranzacții</button>
          </div>
        )}

        {currentTab === 'savings' && (
          <div className="savings-tab">
            <h3>Economii</h3>
            <p>Economii disponibile: 1000 RON</p>
            <button>Adaugă Economii</button>
            <button>Vezi Detalii</button>
          </div>
        )}

        {currentTab === 'investments' && (
          <div className="investments-tab">
            <h3>Investiții</h3>
            <p>Investiții active: 1500 RON</p>
            <button>Adaugă Investiție</button>
            <button>Vezi Detalii</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
