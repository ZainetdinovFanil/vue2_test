import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://dev.moydomonline.ru/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
