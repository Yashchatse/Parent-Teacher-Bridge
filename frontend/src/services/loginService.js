import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      const isLoginAttempt = requestUrl.includes('/login/login/admin/login')

      // For general 401s, clear auth and send back to home where login is shown
      if (!isLoginAttempt) {
        try {
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
        } catch {}
        if (typeof window !== 'undefined' && window.location?.pathname !== '/') {
          window.location.href = '/'
        }
      }
      // If it's a login attempt, do not redirect; let the caller handle the error
    }
    return Promise.reject(error);
  }
);

export const loginService = {
  // Admin login
  async adminLogin(email, password) {
    try {
      console.log('🔐 Attempting admin login:', { email });
      
      const response = await apiClient.post('/login/login/admin/login', {
        email: email,
        password: password
      });

      console.log('✅ Admin login successful:', response.data);
      
      // Store token and user data
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      
      // Decode token to get user info (you might want to get this from your backend)
      const userData = {
        email: email,
        role: 'admin',
        name: email.split('@')[0] // Fallback name from email
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return {
        success: true,
        user: userData,
        token: token
      };
    } catch (error) {
      console.error('❌ Admin login failed:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      return {
        success: false,
        error: error.response?.data || 'Login failed. Please try again.'
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    console.log('🔓 User logged out');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }
};

export default loginService;
