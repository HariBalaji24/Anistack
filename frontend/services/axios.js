import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.jikan.moe/v4/',
});

export default axiosInstance;
