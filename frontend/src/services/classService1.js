// classService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

class ClassService {
  async getAllClasses() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/Admins/classes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  async getClassById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/Admins/classes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    }
  }
}

export const classService = new ClassService();