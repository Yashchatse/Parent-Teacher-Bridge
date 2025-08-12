// useStudent.tsx
import { useState, useEffect, useCallback } from 'react';
import { studentService } from '../services/studentService';

export interface Student {
  studentId: number;
  name: string;
  dob?: string;
  gender?: string;
  enrollmentNo?: string;
  bloodGroup?: string;
  classId?: number;
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentDto {
  name: string;
  dob?: string;
  gender?: string;
  enrollmentNo?: string;
  bloodGroup?: string;
  classId?: number;
  profilePhoto?: string;
}

export interface UpdateStudentDto {
  name?: string;
  dob?: string;
  gender?: string;
  enrollmentNo?: string;
  bloodGroup?: string;
  classId?: number;
  profilePhoto?: string;
}

export const useStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear success message after a delay
  const clearSuccessMessage = useCallback(() => {
    if (successMessage) {
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, [successMessage]);

  useEffect(() => {
    clearSuccessMessage();
  }, [successMessage, clearSuccessMessage]);

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch student by ID
  const getStudent = useCallback(async (id: number): Promise<Student | null> => {
    setLoading(true);
    setError(null);
    try {
      const student = await studentService.getStudentById(id);
      return student;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch students by class
  const getStudentsByClass = useCallback(async (classId: number): Promise<Student[]> => {
    setLoading(true);
    setError(null);
    try {
      // studentService does not have getStudentsByClass, so we filter manually
      const allStudents = await studentService.getAllStudents();
      const filtered = allStudents.filter((student: Student) => student.classId === classId);
      return filtered;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students by class');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Search students
  const searchStudents = useCallback(async (term: string): Promise<Student[]> => {
    if (!term.trim()) return students;
    
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.searchStudents(term);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search students');
      return [];
    } finally {
      setLoading(false);
    }
  }, [students]);

  // Create student
  const createStudent = useCallback(async (studentData: CreateStudentDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newStudent = await studentService.createStudent(studentData);
      // Refresh the entire list to get the latest data from server
      await fetchStudents();
      setSuccessMessage('Student created successfully!');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  // Update student
  const updateStudent = useCallback(async (id: number, studentData: UpdateStudentDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await studentService.updateStudent(id, studentData);
      if (success) {
        // Refresh the entire list to get the latest data from server
        await fetchStudents();
        setSuccessMessage('Student updated successfully!');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  // Delete student
  const deleteStudent = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await studentService.deleteStudent(id);
      if (success) {
        // Refresh the entire list to get the latest data from server
        await fetchStudents();
        setSuccessMessage('Student deleted successfully!');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    successMessage,
    fetchStudents,
    getStudent,
    getStudentsByClass,
    searchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    clearError: () => setError(null),
    clearSuccessMessage: () => setSuccessMessage(null),
  };
};