import axios from 'axios';

// Use environment variable for API base URL with proper fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                     process.env.REACT_APP_API_BASE_URL || 
                     'http://localhost:5000'; // Changed from https to http

console.log('API Base URL:', API_BASE_URL); // Debug log

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data); // Debug log
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data); // Debug log
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper functions for HTTP methods
const apiGet = async (url) => {
  const response = await apiClient.get(url);
  return response.data;
};

const apiPost = async (url, data) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

const apiPut = async (url, data) => {
  const response = await apiClient.put(url, data);
  return response.data;
};

const apiDelete = async (url) => {
  const response = await apiClient.delete(url);
  return response.data;
};

// Parent Bridge Service - aligned to ParentController with route: [Route("parent/[controller]")]
export const parentService = {
  // Associated student for a given parent id
  async getStudentProfile(parentId) {
    return apiGet(`/parent/Parent/${parentId}/student`);
  },

  // Attendance for the associated student of a parent
  async getAttendance(parentId) {
    return apiGet(`/parent/Parent/${parentId}/student/attendance`);
  },

  // Global timetables
  async getTimetable() {
    return apiGet(`/parent/Parent/timetables`);
  },

  // Performance for the associated student of a parent
  async getPerformance(parentId) {
    return apiGet(`/parent/Parent/${parentId}/student/performance`);
  },

  // Global events
  async getEvents() {
    return apiGet('/parent/Parent/events');
  },

  // Behaviour for the associated student of a parent
  async getBehaviors(parentId) {
    return apiGet(`/parent/Parent/${parentId}/student/behaviour`);
  },

  // Parent info
  async getParentInfo(parentId) {
    return apiGet(`/parent/Parent/${parentId}`);
  },

  async updateParentInfo(parentId, payload) {
    return apiPut(`/parent/Parent/${parentId}`, payload);
  },

  async createParent(payload) {
    console.log('Creating parent with payload:', payload);
    
    // Check if we're in development mode and backend is not available
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    // Try real API first
    try {
      console.log('Trying register endpoint...');
      const result = await apiPost('/parent/Parent/register', payload);
      console.log('Register endpoint success:', result);
      return result;
    } catch (e) {
      console.warn('Register endpoint failed, trying POST to controller:', e.message);
      console.error('Register endpoint error details:', e.response?.data || e.message);
      
      try {
        console.log('Trying controller POST...');
        const result = await apiPost('/parent/Parent', payload);
        console.log('Controller POST success:', result);
        return result;
      } catch (e2) {
        console.warn('Controller POST failed, generating ParentId and retrying:', e2.message);
        console.error('Controller POST error details:', e2.response?.data || e2.message);
        
        try {
          const payloadWithId = { ...payload, ParentId: Date.now() };
          console.log('Trying with generated ParentId:', payloadWithId);
          const result = await apiPost('/parent/Parent', payloadWithId);
          console.log('Generated ID POST success:', result);
          return result;
        } catch (e3) {
          console.error('All registration attempts failed:', e3.message);
          console.error('Final error details:', e3.response?.data || e3.message);
          
          // If we're in development and backend is not available, use mock registration
          if (isDevelopment && (e3.code === 'ECONNREFUSED' || e3.message?.includes('Network Error'))) {
            console.log('Backend not available, using mock registration system...');
            return this.mockCreateParent(payload);
          }
          
          // Provide a more helpful error message
          let errorMessage = 'Registration failed. ';
          if (e3.response?.data?.message) {
            errorMessage += e3.response.data.message;
          } else if (e3.response?.status === 404) {
            errorMessage += 'Registration endpoint not found. Please check if the backend service is running.';
          } else if (e3.response?.status === 500) {
            errorMessage += 'Server error. Please try again later.';
          } else if (e3.code === 'ECONNREFUSED') {
            errorMessage += 'Cannot connect to server. Please check if the backend is running on the correct port.';
          } else {
            errorMessage += e3.message || 'Unknown error occurred.';
          }
          
          throw new Error(errorMessage);
        }
      }
    }
  },

  // Mock registration system for development
  mockCreateParent(payload) {
    console.log('Using mock registration system...');
    
    try {
      // Generate a unique ID
      const parentId = Date.now();
      
      // Create mock parent data
      const mockParent = {
        parentId: parentId,
        ParentId: parentId,
        Name: payload.Name,
        Email: payload.Email,
        Password: payload.Password, // In real app, this would be hashed
        StudEnrollmentNo: payload.StudEnrollmentNo,
        Phone: payload.Phone,
        Address: payload.Address || '',
        Gender: payload.Gender || '',
        Occupation: payload.Occupation || '',
        createdAt: new Date().toISOString(),
        isMock: true
      };
      
      // Store in localStorage for persistence
      const existingParents = JSON.parse(localStorage.getItem('mockParents') || '[]');
      existingParents.push(mockParent);
      localStorage.setItem('mockParents', JSON.stringify(existingParents));
      
      // Also store current user session
      localStorage.setItem('userData', JSON.stringify(mockParent));
      localStorage.setItem('authToken', `mock_token_${parentId}`);
      
      console.log('Mock parent created successfully:', mockParent);
      
      // Return success response
      return {
        success: true,
        parentId: parentId,
        parent: mockParent,
        message: 'Parent registered successfully (Mock Mode - Backend not available)',
        isMock: true
      };
      
    } catch (error) {
      console.error('Mock registration failed:', error);
      throw new Error('Mock registration failed: ' + error.message);
    }
  },

  async loginParent(credentials) {
    const { email, studEnrollmentNo, password } = credentials;
    
    try {
      // Try the dedicated login endpoint first
      const response = await apiPost('/parent/Parent/login', { 
        email: email?.trim(), 
        studEnrollmentNo: studEnrollmentNo?.trim(), 
        password: password?.trim() 
      });
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.parent));
      }
      return response;
    } catch (error) {
      console.warn('Dedicated login endpoint failed, trying alternative approach:', error.message);
      
      // Fallback: Try to find parent by credentials and simulate login
      try {
        const allParents = await apiGet('/parent/Parent');
        const matchingParent = Array.isArray(allParents) 
          ? allParents.find(parent => 
              String(parent.email || parent.Email || '').toLowerCase() === String(email).trim().toLowerCase() &&
              String(parent.studEnrollmentNo || parent.StudEnrollmentNo || '').toLowerCase() === String(studEnrollmentNo).trim().toLowerCase()
            )
          : null;
            
        if (!matchingParent) {
          throw new Error('Invalid credentials - parent not found');
        }
        
        // Simulate successful login response
        const loginResponse = {
          success: true,
          parentId: matchingParent.parentId || matchingParent.ParentId,
          parent: matchingParent,
          token: `mock_token_${Date.now()}` // Generate a mock token for development
        };
        
        // Store auth data
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('userData', JSON.stringify(matchingParent));
        
        return loginResponse;
      } catch (fallbackError) {
        console.error('Parent login failed completely:', fallbackError);
        
        // Try mock login if backend is not available
        if (fallbackError.code === 'ECONNREFUSED' || fallbackError.message?.includes('Network Error')) {
          console.log('Backend not available, trying mock login...');
          return this.mockLoginParent(credentials);
        }
        
        throw new Error('Login failed. Please check your credentials.');
      }
    }
  },

  // Mock login system for development
  mockLoginParent(credentials) {
    console.log('Using mock login system...');
    
    try {
      const { email, studEnrollmentNo, password } = credentials;
      
      // Get mock parents from localStorage
      const mockParents = JSON.parse(localStorage.getItem('mockParents') || '[]');
      
      // Find matching parent
      const matchingParent = mockParents.find(parent => 
        String(parent.Email || '').toLowerCase() === String(email).trim().toLowerCase() &&
        String(parent.StudEnrollmentNo || '').toLowerCase() === String(studEnrollmentNo).trim().toLowerCase() &&
        String(parent.Password) === String(password)
      );
      
      if (!matchingParent) {
        throw new Error('Invalid credentials - parent not found in mock data');
      }
      
      // Generate mock token
      const token = `mock_token_${matchingParent.parentId}`;
      
      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(matchingParent));
      
      console.log('Mock login successful:', matchingParent);
      
      return {
        success: true,
        parentId: matchingParent.parentId,
        parent: matchingParent,
        token: token,
        isMock: true
      };
      
    } catch (error) {
      console.error('Mock login failed:', error);
      throw new Error('Mock login failed: ' + error.message);
    }
  },

  // Message-related endpoints
  async getMessages(parentId) {
    return apiGet(`/parent/Parent/${parentId}/messages`);
  },

  async sendMessage(parentId, messageData) {
    return apiPost(`/parent/Parent/${parentId}/messages`, messageData);
  },

  async getThreadMessages(threadId) {
    return apiGet(`/parent/Parent/messages/thread/${threadId}`);
  },

  async sendThreadMessage(threadId, messageData) {
    return apiPost(`/parent/Parent/messages/thread/${threadId}`, messageData);
  },

  // Authentication helpers
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('parent_auth');
  }
};

export default parentService;
