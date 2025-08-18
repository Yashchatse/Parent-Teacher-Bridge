import { useState, useEffect, useCallback } from 'react';
import teacherService from '../services/teacherService';

interface Teacher {
  teacherId: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  photo?: string;
  qualification?: string;
  experienceYears?: number;
  isActive?: boolean;
  createdAt?: string;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all teachers
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teachers');
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get active teachers
  const fetchActiveTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherService.getActiveTeachers();
      setTeachers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch active teachers');
      console.error('Error fetching active teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new teacher
  const createTeacher = useCallback(async (teacherData: Partial<Teacher>) => {
    setLoading(true);
    setError(null);
    try {
      const newTeacher = await teacherService.createTeacher(teacherData);
      setTeachers(prev => [...prev, newTeacher]);
      return newTeacher;
    } catch (err: any) {
      setError(err.message || 'Failed to create teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update teacher
  const updateTeacher = useCallback(async (id: number, teacherData: Partial<Teacher>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTeacher = await teacherService.updateTeacher(id, teacherData);
      setTeachers(prev => prev.map(teacher => 
        teacher.teacherId === id ? updatedTeacher : teacher
      ));
      return updatedTeacher;
    } catch (err: any) {
      setError(err.message || 'Failed to update teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete teacher
  const deleteTeacher = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await teacherService.deleteTeacher(id);
      setTeachers(prev => prev.filter(teacher => teacher.teacherId !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get teacher by ID
  const getTeacherById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const teacher = await teacherService.getTeacherById(id);
      return teacher;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search teachers
  const searchTeachers = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await teacherService.searchTeachers(searchTerm);
      setTeachers(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search teachers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    fetchActiveTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    searchTeachers,
    clearError
  };
}; 