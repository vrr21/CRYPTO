import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateItem } from '../../slices/portfolioSlice';
import axios from '../../api/instance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './CryptoDetail.css';

const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cryptos = useSelector((state: any) => state.cryptos.list);

  const [crypto, setCrypto] = useState<any | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('d1'); // Default to daily data.

  useEffect(() => {
    const fetchCrypto = async () => {
      const selectedCrypto = cryptos.find((c: any) => c.id === id);
      setCrypto(selectedCrypto);

      if (selectedCrypto) {
        await fetchChartData(selectedCrypto.id, timeframe);
      }
    };

    const fetchChartData = async (cryptoId: string, interval: string) => {
      setLoading(true);

      // Генерируем временные рамки для запросов (start и end)
      const now = Date.now();
      let start: number;

      switch (interval) {
        case 'h12': // Last 7 days
          start = now - 7 * 24 * 60 * 60 * 1000; // 7 days ago
          break;
        case 'd1': // Last 30 days
          start = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
          break;
        default: // For 'd1' (daily interval for 1 day)
          start = now - 1 * 24 * 60 * 60 * 1000; // 1 day ago
      }

      try {
        const response = await axios.get(
          `assets/${cryptoId}/history?interval=${interval}&start=${start}&end=${now}`
        );
        const data = response.data.data.map((point: any) => ({
          date: new Date(point.time).toLocaleDateString(),
          price: parseFloat(point.priceUsd),
        }));
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrypto();
  }, [id, timeframe, cryptos]);

  if (!crypto) return <p>Loading...</p>;

  const handleAddToPortfolio = () => {
    dispatch(
      addOrUpdateItem({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: parseFloat(crypto.priceUsd),
        amount: 1,
      })
    );
    alert(`${crypto.name} added to Portfolio!`);
  };

  return (
    <div className="crypto-detail">
      <div className="action-buttons">
        <button onClick={handleAddToPortfolio} className="add-btn">
          Add to Portfolio
        </button>
        <button className="back-btn" onClick={() => navigate('/')}>
          Back
        </button>
      </div>

      <div className="crypto-header">
        <img
          src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
          alt={crypto.name}
          className="crypto-logo"
        />
        <h2>
          {crypto.name} ({crypto.symbol})
        </h2>
      </div>

      <table className="crypto-table">
        <tbody>
          <tr>
            <td>
              <strong>Price:</strong>
            </td>
            <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
          </tr>
          <tr>
            <td>
              <strong>Market Cap:</strong>
            </td>
            <td>${(parseFloat(crypto.marketCapUsd) / 1e9).toFixed(2)}B</td>
          </tr>
          <tr>
            <td>
              <strong>Change (24h):</strong>
            </td>
            <td>
              <span
                className={
                  parseFloat(crypto.changePercent24Hr) > 0
                    ? 'positive-change'
                    : 'negative-change'
                }
              >
                {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="chart-controls">
        <label htmlFor="timeframe-select">Timeframe:</label>
        <select
          id="timeframe-select"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="d1">Day</option>
          <option value="h12">Week</option>
          <option value="m1">Month</option>
        </select>
      </div>

      <div className="crypto-chart">
        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width={1396} height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
