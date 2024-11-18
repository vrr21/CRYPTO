// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CryptoTable from './components/CryptoTable/CryptoTable';
import CryptoDetail from './components/CryptoCurrency/CryptoDetail';  // Импортируем новый компонент

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Основная страница с таблицей криптовалют */}
          <Route path="/" element={<CryptoTable />} />
          {/* Страница с деталями криптовалюты */}
          <Route path="/crypto/:id" element={<CryptoDetail />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
