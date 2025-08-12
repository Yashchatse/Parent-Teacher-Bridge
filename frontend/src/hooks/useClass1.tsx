// useClass.tsx
import { useState, useEffect, useCallback } from 'react';
import { classService } from '../services/classService1';

export interface SchoolClass {
  classId: number;
  className: string;
  section?: string;
  grade?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useClass = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get class by ID
  const getClassById = useCallback(async (id: number): Promise<SchoolClass | null> => {
    setLoading(true);
    setError(null);
    try {
      const schoolClass = await classService.getClassById(id);
      return schoolClass;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load classes on mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    fetchClasses,
    getClassById,
    clearError: () => setError(null),
  };
};