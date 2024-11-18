
import React from 'react';
import { useSelector } from 'react-redux';
import './CryptoCurrency.css';

const CryptoCurrency: React.FC = () => {
  const { list: cryptos } = useSelector((state: any) => state.cryptos);
  const bitcoin = cryptos.find((crypto: any) => crypto.symbol === 'BTC');
  const ethereum = cryptos.find((crypto: any) => crypto.symbol === 'ETH');
  const tether = cryptos.find((crypto: any) => crypto.symbol === 'USDT');

  return (
    <div className="crypto-currency">
      <h2>Crypto Currency</h2>
      <div className="crypto-info">
        {bitcoin && <div className="crypto-item"><strong>Bitcoin:</strong> {bitcoin.priceUsd} USD</div>}
        {ethereum && <div className="crypto-item"><strong>Ethereum:</strong> {ethereum.priceUsd} USD</div>}
        {tether && <div className="crypto-item"><strong>Tether:</strong> {tether.priceUsd} USD</div>}
      </div>
      {/* Portfolio Section */}
      <div className="portfolio-info">
        <p><strong>Portfolio cost:</strong> <span>0.00 $</span></p>
        <p><strong>Portfolio change:</strong> <span>+0.00 (0.00%)</span></p>
      </div>
    </div>
  );
};

export default CryptoCurrency;
