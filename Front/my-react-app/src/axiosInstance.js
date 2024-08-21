import axios from 'axios';

// Create an Axios instance with the base URL from environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});
  
export default axiosInstance;
  