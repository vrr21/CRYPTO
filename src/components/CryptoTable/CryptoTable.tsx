import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCryptos } from '../../slices/cryptoSlice';
import { addOrUpdateItem, setPortfolio } from '../../slices/portfolioSlice';
import './CryptoTable.css';
import Pagination from '../Pagination/Pagination';
import PortfolioModal from '../Portfolio/PortfolioModal';

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch<any>(); // Типизируем dispatch через AppDispatch, если используете.
  const cryptos = useSelector((state: any) => state.cryptos.list); // Получаем список криптовалют из Redux
  const portfolio = useSelector((state: any) => state.portfolio.items); // Данные портфеля
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(''); // Поиск криптовалют
  const [showNullValues, setShowNullValues] = useState(false); // Показать или скрыть нулевые значения
  const [selectedCrypto, setSelectedCrypto] = useState<any | null>(null); // Выбранная криптовалюта
  const [showModal, setShowModal] = useState(false); // Отображение модального окна
  const [cryptoAmount, setCryptoAmount] = useState(1); // Количество криптовалют для добавления
  const [portfolioCost, setPortfolioCost] = useState(0); // Общая стоимость портфеля
  const [portfolioChange, setPortfolioChange] = useState(0); // Изменение стоимости портфеля
  const [showPortfolioModal, setShowPortfolioModal] = useState(false); // Показать модальное окно портфеля
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const itemsPerPage = 100; // Количество криптовалют на странице
  const totalPages = Math.ceil(2000 / itemsPerPage); // Предполагаем, что максимум 2000 криптовалют.

  useEffect(() => {
    // Загружаем данные для текущей страницы
    dispatch(fetchCryptos({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    // Загружаем сохраненный портфель из localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      dispatch(setPortfolio(JSON.parse(savedPortfolio)));
    }
  }, [dispatch]);

  useEffect(() => {
    // Обновляем localStorage и пересчитываем статистику портфеля
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    updatePortfolioStats();
  }, [portfolio]);

  const updatePortfolioStats = () => {
    let totalCost = 0;
    let totalChange = 0;

    portfolio.forEach((item: any) => {
      const cost = item.amount * item.price;
      const change = (cost * (item.changePercent24Hr || 0)) / 100;
      totalCost += cost;
      totalChange += change;
    });

    setPortfolioCost(totalCost);
    setPortfolioChange(totalChange);
  };

  const getImageForCrypto = (symbol: string) => {
    return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;
  };

  const filteredCryptos = cryptos.filter((crypto: any) => {
    const matchesSearch = crypto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const showNulls = showNullValues || (!showNullValues && crypto.priceUsd !== null);
    return matchesSearch && showNulls;
  });

  const bitcoin = cryptos.find((crypto: any) => crypto.symbol === 'BTC');
  const ethereum = cryptos.find((crypto: any) => crypto.symbol === 'ETH');
  const tether = cryptos.find((crypto: any) => crypto.symbol === 'USDT');

  const handleCryptoClick = (cryptoId: string) => {
    navigate(`/crypto/${cryptoId}`);
  };

  const handleAddToPortfolio = (crypto: any) => {
    setSelectedCrypto(crypto);
    setShowModal(true);
  };

  const handleAmountChange = (amount: number) => {
    if (amount >= 1) {
      setCryptoAmount(amount);
    }
  };

  const confirmAddToPortfolio = () => {
    dispatch(
      addOrUpdateItem({
        id: selectedCrypto.id,
        name: selectedCrypto.name,
        symbol: selectedCrypto.symbol,
        price: parseFloat(selectedCrypto.priceUsd),
        amount: cryptoAmount,
        changePercent24Hr: parseFloat(selectedCrypto.changePercent24Hr),
      })
    );

    setShowModal(false);
    setSelectedCrypto(null);
    setCryptoAmount(1);
  };

  const handleOpenPortfolioModal = () => {
    setShowPortfolioModal(true);
  };

  const handleClosePortfolioModal = () => {
    setShowPortfolioModal(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="crypto-header">
        <h2>Crypto Currency</h2>
        <div className="crypto-header-info">
          <span>
            <strong>Bitcoin:</strong> {bitcoin ? `${parseFloat(bitcoin.priceUsd).toFixed(2)} USD` : 'Loading...'}
          </span>
          <span>
            <strong>Ethereum:</strong> {ethereum ? `${parseFloat(ethereum.priceUsd).toFixed(2)} USD` : 'Loading...'}
          </span>
          <span>
            <strong>Tether:</strong> {tether ? `${parseFloat(tether.priceUsd).toFixed(2)} USD` : 'Loading...'}
          </span>
        </div>
        <div className="portfolio-info" onClick={handleOpenPortfolioModal} style={{ cursor: 'pointer' }}>
          <p>
            <strong>Portfolio cost:</strong> <span>{portfolioCost.toFixed(2)} $</span>
          </p>
          <p>
            <strong>Portfolio change:</strong> <span>{portfolioChange.toFixed(2)} $</span>
          </p>
        </div>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showNullValues}
            onChange={(e) => setShowNullValues(e.target.checked)}
          />
          Show null values
        </label>
      </div>

      <table className="crypto-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Change (24h)</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map((crypto: any, index: number) => (
            <tr key={crypto.id}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td>
                <img src={getImageForCrypto(crypto.symbol)} alt={crypto.name} className="crypto-image" />
              </td>
              <td onClick={() => handleCryptoClick(crypto.id)} style={{ cursor: 'pointer', color: '#fff' }}>
                {crypto.name}
              </td>
              <td>{crypto.symbol}</td>
              <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
              <td>${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B</td>
              <td className={parseFloat(crypto.changePercent24Hr) >= 0 ? 'positive-change' : 'negative-change'}>
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </td>
              <td>
                <button onClick={() => handleAddToPortfolio(crypto)}>Add to portfolio</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>{selectedCrypto?.name}</h3>
            <p>Amount:</p>
            <input
              type="number"
              value={cryptoAmount}
              onChange={(e) => handleAmountChange(parseInt(e.target.value))}
              min="1"
            />
            <button onClick={confirmAddToPortfolio}>Confirm</button>
          </div>
        </div>
      )}

      {showPortfolioModal && <PortfolioModal onClose={handleClosePortfolioModal} />}
    </div>
  );
};

export default CryptoTable;
