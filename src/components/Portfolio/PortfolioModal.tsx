// src/components/PortfolioModal.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeItem,
  updateItemAmount,
} from '../../slices/portfolioSlice';
import './PortfolioModal.css';

interface PortfolioModalProps {
  onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const portfolio = useSelector((state: any) => state.portfolio.items);

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleUpdateAmount = (id: string, amount: number) => {
    if (amount > 0) {
      dispatch(updateItemAmount({ id, amount }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Portfolio</h3>
        {portfolio.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item: any, index: number) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.symbol}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={item.amount}
                      min="1"
                      onChange={(e) =>
                        handleUpdateAmount(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleRemove(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in portfolio.</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioModal;
