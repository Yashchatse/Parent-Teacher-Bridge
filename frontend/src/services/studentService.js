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

export const studentService = {
  async getAllStudents() {
    try {
      const response = await apiClient.get('/admin/Admins/students');
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      // Return mock data for now
      return [
        { studentId: 1, name: "Alice Johnson", enrollmentNo: "EN001", classId: 1, gender: "Female", bloodGroup: "A+" },
        { studentId: 2, name: "Bob Smith", enrollmentNo: "EN002", classId: 1, gender: "Male", bloodGroup: "B+" },
        { studentId: 3, name: "Carol Davis", enrollmentNo: "EN003", classId: 2, gender: "Female", bloodGroup: "O+" },
      ];
    }
  },

  async getStudentById(id) {
    try {
      const response = await apiClient.get(`/admin/Admins/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      throw new Error('Failed to fetch student');
    }
  },

  async createStudent(studentData) {
    try {
      const allStudents = await this.getAllStudents();
      const lastId = allStudents.length > 0 
        ? Math.max(...allStudents.map(s => s.studentId || s.StudentId || 0)) 
        : 0;
      const newId = lastId + 1;

      // Shape payload to match backend example (camelCase)
      const payload = {
        studentId: newId,
        name: studentData.name,
        dob: studentData.dob,
        gender: studentData.gender,
        enrollmentNo: studentData.enrollmentNo,
        bloodGroup: studentData.bloodGroup,
        classId: studentData.classId,
        profilePhoto: studentData.profilePhoto ?? ''
      };

      const response = await apiClient.post('/admin/Admins/students', payload);
      return response.data || payload;
    } catch (error) {
      console.error('Error creating student:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error('Failed to create student');
    }
  },

  async updateStudent(id, studentData) {
    try {
      // Transform to camelCase payload aligned with createStudent
      const payload = { studentId: id };
      if (studentData.name !== undefined) payload.name = studentData.name;
      if (studentData.enrollmentNo !== undefined) payload.enrollmentNo = studentData.enrollmentNo;
      if (studentData.gender !== undefined) payload.gender = studentData.gender;
      if (studentData.bloodGroup !== undefined) payload.bloodGroup = studentData.bloodGroup;
      if (studentData.classId !== undefined) payload.classId = studentData.classId;
      if (studentData.dob !== undefined) payload.dob = studentData.dob;
      if (studentData.profilePhoto !== undefined) payload.profilePhoto = studentData.profilePhoto;

      // The backend expects a 204 No Content response for successful updates
      const res = await apiClient.put(`/admin/Admins/students/${id}`, payload);
      return res.status === 204 || res.status === 200;
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response?.status === 404) {
        throw new Error('Student not found');
      }
      throw new Error('Failed to update student');
    }
  },

  async deleteStudent(id) {
    try {
      // The backend expects a 204 No Content response for successful deletions
      await apiClient.delete(`/admin/Admins/students/${id}`);
      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error deleting student:', error);
      if (error.response?.status === 404) {
        throw new Error('Student not found');
      }
      throw new Error('Failed to delete student');
    }
  },

  async searchStudents(searchTerm) {
    try {
      const response = await apiClient.get('/admin/Admins/students/search', {
        params: { term: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching students:', error);
      throw new Error('Failed to search students');
    }
  }
};

export default studentService;