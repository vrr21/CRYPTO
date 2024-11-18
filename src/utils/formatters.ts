export const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(2);
  };
  
  export const formatMarketCap = (marketCap: string) => {
    return (parseFloat(marketCap) / 1e9).toFixed(2) + 'B';
  };
  