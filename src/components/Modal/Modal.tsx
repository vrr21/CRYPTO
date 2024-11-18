import React from 'react';
import { useDispatch } from 'react-redux';
import { addOrUpdateItem } from '../../slices/portfolioSlice';

const Modal: React.FC<any> = ({ isOpen, onClose, crypto }) => {
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(addOrUpdateItem({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      price: parseFloat(crypto.priceUsd),
      amount: 1,
    }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>x</button>
        <h3>Add {crypto.name} to Portfolio</h3>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default Modal;
