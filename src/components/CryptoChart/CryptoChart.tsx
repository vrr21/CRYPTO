// src/components/CryptoChart/CryptoChart.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from '../../api/instance';
import './CryptoChart.css';

const CryptoChart: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoHistory = async () => {
      try {
        const response = await axios.get(`assets/${symbol}/history?interval=d1`);
        const historyData = response.data.data.map((point: any) => ({
          date: new Date(point.time).toLocaleDateString(),
          price: parseFloat(point.priceUsd),
        }));
        setData(historyData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto history", error);
        setLoading(false);
      }
    };
    fetchCryptoHistory();
  }, [symbol]);

  return (
    <div className="crypto-chart-container">
      <h2>{symbol} Price Chart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CryptoChart;
