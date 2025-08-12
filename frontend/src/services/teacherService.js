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

const teacherService = {
  // Get the next available ID by fetching all teachers and finding max ID
  async getNextTeacherId() {
    try {
      const teachers = await this.getAllTeachers();
      if (teachers && teachers.length > 0) {
        const maxId = Math.max(...teachers.map(t => t.teacherId || 0));
        return maxId + 1;
      }
      return 1; // Start with ID 1 if no teachers exist
    } catch (error) {
      console.error('Error getting next teacher ID:', error);
      return Date.now(); // Fallback to timestamp
    }
  },

  async getAllTeachers() {
    try {
      const response = await apiClient.get('/admin/Admins/teachers');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to fetch teachers';
      throw new Error(errorMessage);
    }
  },

  async getTeacherById(id) {
    try {
      const response = await apiClient.get(`/admin/Admins/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher by ID:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to fetch teacher';
      throw new Error(errorMessage);
    }
  },

  async createTeacher(teacherData) {
    try {
      // Get the next available ID
      const nextId = await this.getNextTeacherId();
      
      // Prepare the data with the generated ID
      const dataToSend = {
        ...teacherData,
        teacherId: nextId
      };

      console.log('Creating teacher with data:', dataToSend);
      
      const response = await apiClient.post('/admin/Admins/teachers', dataToSend);
      
      if (response.data && typeof response.data === 'object' && response.data.teacherId) {
        return response.data;
      } else {
        // Return the data we sent since the API might just return success status
        return dataToSend;
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      let errorMessage = 'Failed to create teacher';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors = Object.values(error.response.data.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  async updateTeacher(id, teacherData) {
    try {
      // Ensure the teacherId matches the URL parameter
      const dataToSend = {
        ...teacherData,
        teacherId: id
      };

      console.log('Updating teacher with data:', dataToSend);
      
      const response = await apiClient.put(`/admin/Admins/teachers/${id}`, dataToSend);
      
      // PUT typically returns 204 No Content on success, so we return the updated data
      if (response.status === 204 || response.status === 200) {
        return dataToSend;
      }
      
      return response.data || dataToSend;
    } catch (error) {
      console.error('Error updating teacher:', error);
      let errorMessage = 'Failed to update teacher';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors = Object.values(error.response.data.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  async deleteTeacher(id) {
    try {
      const response = await apiClient.delete(`/admin/Admins/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting teacher:', error);
      let errorMessage = 'Failed to delete teacher';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  async getActiveTeachers() {
    try {
      const response = await apiClient.get('/admin/Admins/teachers/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active teachers:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to fetch active teachers';
      throw new Error(errorMessage);
    }
  },

  async searchTeachers(searchTerm) {
    try {
      // If search term is empty, get all teachers
      if (!searchTerm || searchTerm.trim() === '') {
        return await this.getAllTeachers();
      }
      
      const response = await apiClient.get('/admin/Admins/teachers/search', {
        params: { term: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching teachers:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to search teachers';
      throw new Error(errorMessage);
    }
  }
};

export default teacherService;