import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend API base URL
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or other auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      // Avoid using useNavigate here as this is not a component
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
