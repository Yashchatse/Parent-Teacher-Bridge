// Enhanced admin service with better error handling and debugging
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44317/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor with enhanced logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        data: error.config?.data
      }
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Create a more informative error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.response?.data || 
                        error.message || 
                        'An unknown error occurred';
    
    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

export const adminService = {
  async getAllAdmins() {
    try {
      const response = await api.get('/Admins');
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error(`Failed to fetch admins: ${error.message}`);
    }
  },

  async getAdminById(id) {
    try {
      const response = await api.get(`/Admins/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin ${id}:`, error);
      throw new Error(`Failed to fetch admin ${id}: ${error.message}`);
    }
  },

  async createAdmin(adminData) {
    try {
      // Validate required fields
      if (!adminData.name || !adminData.email || !adminData.password) {
        throw new Error('Name, email, and password are required fields');
      }

      // Get the next available ID by fetching current admins
      const currentAdmins = await this.getAllAdmins();
      const maxId = currentAdmins.length > 0 ? Math.max(...currentAdmins.map(admin => admin.adminId || admin.AdminId || 0)) : 0;
      const nextId = maxId + 1;

      // Transform property names to match C# Pascal case conventions
      const transformedData = {
        AdminId: nextId,  // Set the next ID
        Name: adminData.name,
        Email: adminData.email,
        Password: adminData.password,
        Status: adminData.status || 'Active'
      };

      console.log('📝 Creating admin with transformed data:', transformedData);
      
      const response = await api.post('/Admins', transformedData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  async updateAdmin(id, adminData) {
    try {
      // Transform property names to match C# Pascal case conventions
      const transformedData = {};
      
      if (adminData.name !== undefined) transformedData.Name = adminData.name;
      if (adminData.email !== undefined) transformedData.Email = adminData.email;
      if (adminData.password !== undefined) transformedData.Password = adminData.password;
      if (adminData.status !== undefined) transformedData.Status = adminData.status;

      console.log(`📝 Updating admin ${id} with transformed data:`, transformedData);
      
      const response = await api.put(`/Admins/${id}`, transformedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating admin ${id}:`, error);
      
      if (error.status === 404) {
        throw new Error(`Admin with ID ${id} not found`);
      } else if (error.status === 400) {
        throw new Error(`Invalid admin data: ${error.message}`);
      } else {
        throw new Error(`Failed to update admin: ${error.message}`);
      }
    }
  },

  async deleteAdmin(id) {
    try {
      const response = await api.delete(`/Admins/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting admin ${id}:`, error);
      
      if (error.status === 404) {
        throw new Error(`Admin with ID ${id} not found`);
      } else {
        throw new Error(`Failed to delete admin: ${error.message}`);
      }
    }
  },

  async searchAdmins(searchTerm) {
    try {
      const response = await api.get('/Admins', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching admins:', error);
      throw new Error(`Failed to search admins: ${error.message}`);
    }
  }
};

export default adminService;