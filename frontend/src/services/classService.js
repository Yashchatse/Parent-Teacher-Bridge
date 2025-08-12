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
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const classService = {
  async getAllClasses() {
    try {
      const response = await apiClient.get('/admin/Admins/classes');
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Return mock data for now
      return [
        { classId: 1, className: "Class 1", section: "A", capacity: 30 },
        { classId: 2, className: "Class 2", section: "B", capacity: 30 },
        { classId: 3, className: "Class 3", section: "C", capacity: 30 },
      ];
    }
  },

  async getClassById(id) {
    try {
        const response = await apiClient.get(`/admin/Admins/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw new Error('Failed to fetch class');
    }
  },

  async getAllTeachers() {
    try {
      const response = await apiClient.get('/admin/Admins/teachers');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Return mock data for now
      return [
        { teacherId: 1, name: "John Doe", email: "john@school.com" },
        { teacherId: 2, name: "Jane Smith", email: "jane@school.com" },
        { teacherId: 3, name: "Mike Johnson", email: "mike@school.com" },
      ];
    }
  },

  async createClass(classData) {
  try {
    // First, fetch all classes to determine the next ID
    const allClasses = await this.getAllClasses();

    // Find max ID and add 1
    const lastId = allClasses.length > 0 
      ? Math.max(...allClasses.map(c => c.classId)) 
      : 0;
    const newId = lastId + 1;

    // Merge new ID into the class data
    const classWithId = { classId: newId, ...classData };

    // Send POST request with generated ID
    const response = await apiClient.post('/admin/Admins/classes', classWithId);
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw new Error('Failed to create class');
  }
},


  async updateClass(id, classData) {
    try {
      const response = await apiClient.put(`/admin/Admins/classes/${id}`, classData);
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw new Error('Failed to update class');
    }
  },

  async deleteClass(id) {
    try {
      const response = await apiClient.delete(`/admin/Admins/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw new Error('Failed to delete class');
    }
  }
};

export default classService;