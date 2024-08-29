import axios from 'axios';

// Create an Axios instance with the base URL from environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({

  baseURL: apiUrl,

  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }

});
  
export default axiosInstance;
  