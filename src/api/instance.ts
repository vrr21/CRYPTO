import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.coincap.io/v2/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'b2a2ba2d-f0ca-47f6-b196-a3b484c998ef', // Замените на ваш API-ключ
  },
});

export default instance;
