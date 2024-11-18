import React, { useState } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: any;
  onConfirm: (amount: number) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, crypto, onConfirm }) => {
  const [amount, setAmount] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>Add {crypto.name} to Portfolio</h3>
        <p>Enter the amount to add:</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          min="1"
        />
        <button
          onClick={() => onConfirm(amount)}
          className="confirm-btn"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Modal;
