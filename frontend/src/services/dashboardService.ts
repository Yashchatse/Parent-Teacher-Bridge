// services/dashboardService.ts
import axios from 'axios';

const BASE_ROOT = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');
const BASE_URL = `${BASE_ROOT.replace(/\/$/, '')}/admin/Admins`;

// Configure axios with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for dashboard data
export interface DashboardCounts {
  adminCount: number;
  teacherCount: number;
  studentCount: number;
  classCount: number;
  subjectCount: number;
}

export interface Admin {
  adminId: number;
  name?: string;
  email?: string;
}

export interface Student {
  studentId: number;
  name?: string;
  email?: string;
}

export interface Teacher {
  teacherId: number;
  name: string;
  email?: string;
}

export interface SchoolClass {
  classId: number;
  className: string;
}

export interface Subject {
  subjectId: number;
  name: string;
  code?: string;
}

class DashboardService {
  // Get all admins (for count)
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const response = await api.get<Admin[]>('');
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Failed to fetch admins');
    }
  }

  // Get all teachers (for count)
  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const response = await api.get<Teacher[]>('/teachers');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch teachers');
    }
  }

  // Get all students (for count)
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await api.get<Student[]>('/student');
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  // Get all classes (for count)
  async getAllClasses(): Promise<SchoolClass[]> {
    try {
      const response = await api.get<SchoolClass[]>('/classes');
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes');
    }
  }

  // Get all subjects (for count)
  async getAllSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get<Subject[]>('/subjects');
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new Error('Failed to fetch subjects');
    }
  }

  // Get dashboard counts for all entities
  async getDashboardCounts(): Promise<DashboardCounts> {
    try {
      console.log('Fetching dashboard counts...');
      
      // Fetch all data in parallel
      const [admins, teachers, students, classes, subjects] = await Promise.all([
        this.getAllAdmins().catch((error) => {
          console.warn('Failed to fetch admins:', error);
          return [];
        }),
        this.getAllTeachers().catch((error) => {
          console.warn('Failed to fetch teachers:', error);
          return [];
        }),
        this.getAllStudents().catch((error) => {
          console.warn('Failed to fetch students:', error);
          return [];
        }),
        this.getAllClasses().catch((error) => {
          console.warn('Failed to fetch classes:', error);
          return [];
        }),
        this.getAllSubjects().catch((error) => {
          console.warn('Failed to fetch subjects:', error);
          return [];
        }),
      ]);

      const counts: DashboardCounts = {
        adminCount: admins.length,
        teacherCount: teachers.length,
        studentCount: students.length,
        classCount: classes.length,
        subjectCount: subjects.length,
      };

      console.log('Dashboard counts fetched:', counts);
      return counts;

    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
      // Return zeros if everything fails
      return {
        adminCount: 0,
        teacherCount: 0,
        studentCount: 0,
        classCount: 0,
        subjectCount: 0,
      };
    }
  }

  // Get counts individually (alternative method)
  async getAdminCount(): Promise<number> {
    try {
      const admins = await this.getAllAdmins();
      return admins.length;
    } catch (error) {
      console.error('Error getting admin count:', error);
      return 0;
    }
  }

  async getTeacherCount(): Promise<number> {
    try {
      const teachers = await this.getAllTeachers();
      return teachers.length;
    } catch (error) {
      console.error('Error getting teacher count:', error);
      return 0;
    }
  }

  async getStudentCount(): Promise<number> {
    try {
      const students = await this.getAllStudents();
      return students.length;
    } catch (error) {
      console.error('Error getting student count:', error);
      return 0;
    }
  }

  async getClassCount(): Promise<number> {
    try {
      const classes = await this.getAllClasses();
      return classes.length;
    } catch (error) {
      console.error('Error getting class count:', error);
      return 0;
    }
  }

  async getSubjectCount(): Promise<number> {
    try {
      const subjects = await this.getAllSubjects();
      return subjects.length;
    } catch (error) {
      console.error('Error getting subject count:', error);
      return 0;
    }
  }
}

export const dashboardService = new DashboardService();