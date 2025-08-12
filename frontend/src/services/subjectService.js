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

export const subjectService = {
  async getAllSubjects() {
    try {
      const response = await apiClient.get('/admin/Admins/subjects');
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Return mock data for now
      return [
        { subjectId: 1, subjectName: "Mathematics", description: "Advanced mathematics", credits: 4 },
        { subjectId: 2, subjectName: "English", description: "English literature", credits: 3 },
        { subjectId: 3, subjectName: "Science", description: "General science", credits: 4 },
      ];
    }
  },

  async getSubjectById(id) {
    try {
      const response = await apiClient.get(`/admin/Admins/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      throw new Error('Failed to fetch subject');
    }
  },

  async createSubject(subjectData) {
    try {

      const allSubjects = await this.getAllSubjects();
      const lastId = allSubjects.length > 0 
        ? Math.max(...allSubjects.map(c => c.subjectId)) 
        : 0;
      const newId = lastId + 1;
      const subjectWithId = { subjectId: newId, ...subjectData };
      const response = await apiClient.post('/admin/Admins/subjects', subjectWithId);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw new Error('Failed to create subject');
    }
  },


  async updateSubject(id, subjectData) {
    try {
      // Backend returns 204 No Content for successful updates
      await apiClient.put(`/admin/Admins/subjects/${id}`, subjectData);
      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error updating subject:', error);
      if (error.response?.status === 404) {
        throw new Error('Subject not found');
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid subject data. Please check the form fields.');
      }
      throw new Error('Failed to update subject');
    }
  },

  async deleteSubject(id) {
    try {
      // Backend returns 204 No Content for successful deletions
      await apiClient.delete(`/admin/Admins/subjects/${id}`);
      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error deleting subject:', error);
      if (error.response?.status === 404) {
        throw new Error('Subject not found');
      }
      throw new Error('Failed to delete subject');
    }
  },

  async searchSubjects(searchTerm) {
    try {
      const response = await apiClient.get('/admin/Admins/subjects/search', {
        params: { term: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching subjects:', error);
      throw new Error('Failed to search subjects');
    }
  }
};

export default subjectService;
