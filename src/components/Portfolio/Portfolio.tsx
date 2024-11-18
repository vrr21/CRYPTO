import React, { useState } from "react";

// Модальное окно для управления портфелем
const PortfolioModal = ({ isOpen, onClose, selectedCurrencies, addToPortfolio, removeFromPortfolio, currencies }: any) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Manage Portfolio</h2>
        
        {/* Список валют для добавления */}
        <div>
          <h3>Add Currency</h3>
          {currencies.map((currency: string) => (
            <button key={currency} onClick={() => addToPortfolio(currency)}>
              Add {currency}
            </button>
          ))}
        </div>

        {/* Выбранные валюты с возможностью удаления */}
        <div>
          <h3>Selected Currencies</h3>
          <ul>
            {selectedCurrencies.map((currency: string, index: number) => (
              <li key={index}>
                {currency} 
                <button onClick={() => removeFromPortfolio(currency)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currencies: string[] = ["USD", "EUR", "GBP", "JPY"];

  // Добавление валюты в портфель
  const addToPortfolio = (currency: string) => {
    if (!selectedCurrencies.includes(currency)) {
      setSelectedCurrencies([...selectedCurrencies, currency]);
    }
  };

  // Удаление валюты из портфеля
  const removeFromPortfolio = (currency: string) => {
    setSelectedCurrencies(selectedCurrencies.filter((c) => c !== currency));
  };

  // Открытие модального окна
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Portfolio Manager</h1>

      {/* Кнопка для открытия модального окна для Portfolio cost */}
      <div>
        <button onClick={openModal}>Portfolio cost</button>
      </div>

      {/* Кнопка для открытия модального окна для Portfolio change */}
      <div>
        <button onClick={openModal}>Portfolio change</button>
      </div>

      {/* Кнопка для открытия модального окна для Add to Portfolio */}
      <div>
        <button onClick={openModal}>Add to Portfolio</button>
      </div>

      {/* Общее модальное окно для всех трех кнопок */}
      <PortfolioModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCurrencies={selectedCurrencies}
        addToPortfolio={addToPortfolio}
        removeFromPortfolio={removeFromPortfolio}
        currencies={currencies}
      />
    </div>
  );
};

export default Portfolio;
