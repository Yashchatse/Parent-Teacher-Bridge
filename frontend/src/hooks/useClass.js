import { useState, useEffect } from 'react';
import { classService } from '../services/classService';

export const useClass = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  // Load all classes
  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load classes');
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load all teachers for dropdown
  const loadTeachers = async () => {
    try {
      const data = await classService.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      console.error('Error loading teachers:', err);
    }
  };

  // Create new class
  const createClass = async (classData) => {
    try {
      setLoading(true);
      setError(null);
      const newClass = await classService.createClass(classData);
      setClasses(prev => [...prev, newClass]);
      return newClass;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to create class';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update class
  const updateClass = async (id, classData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedClass = await classService.updateClass(id, classData);
      setClasses(prev => prev.map(cls => cls.classId === id ? updatedClass : cls));
      return updatedClass;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to update class';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete class
  const deleteClass = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await classService.deleteClass(id);
      setClasses(prev => prev.filter(cls => cls.classId !== id));
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to delete class';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get class by ID
  const getClassById = async (id) => {
    try {
      const classData = await classService.getClassById(id);
      return classData;
    } catch (err) {
      console.error('Error getting class by ID:', err);
      throw err;
    }
  };

  // Get teacher name by ID
const getTeacherName = (teacherId) => {
  if (!teacherId) return 'No Teacher Assigned';
  const teacher = teachers?.find(t => t.teacherId === teacherId);
  return teacher ? teacher.name : 'Unknown Teacher';
};


  // Initialize data on mount
  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, []);

  return {
    classes,
    teachers,
    loading,
    error,
    loadClasses,
    loadTeachers,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    getTeacherName,
    setError,
  };
};