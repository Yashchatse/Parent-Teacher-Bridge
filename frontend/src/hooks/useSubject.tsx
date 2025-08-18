import { useState, useCallback, useEffect } from 'react';
import { subjectService } from '../services/subjectService';

interface Subject {
  subjectId: number;
  name: string;
  code: string;
  createdAt?: string | Date;
}

export const useSubject = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch all subjects
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subjects');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new subject
  const createSubject = useCallback(async (subjectData: Partial<Subject>) => {
    setLoading(true);
    setError(null);
    try {
      const newSubject = await subjectService.createSubject(subjectData);
      // Refresh the list after creation to get the latest data from server
      await fetchSubjects();
      setSuccessMessage('Subject created successfully!');
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create subject');
      console.error('Error creating subject:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSubjects]);

  // Update subject
  const updateSubject = useCallback(async (id: number, subjectData: Partial<Subject>) => {
    setLoading(true);
    setError(null);
    try {
      const success = await subjectService.updateSubject(id, subjectData);
      if (success) {
        // Refresh the list after update to get the latest data from server
        await fetchSubjects();
        setSuccessMessage('Subject updated successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to update subject');
      console.error('Error updating subject:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSubjects]);

  // Delete subject
  const deleteSubject = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await subjectService.deleteSubject(id);
      if (success) {
        // Refresh the list after deletion to get the latest data from server
        await fetchSubjects();
        setSuccessMessage('Subject deleted successfully!');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to delete subject');
      console.error('Error deleting subject:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSubjects]);

  // Get subject by ID
  const getSubjectById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const subject = await subjectService.getSubjectById(id);
      return subject;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subject');
      console.error('Error fetching subject:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search subjects
  const searchSubjects = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all subjects
      return fetchSubjects();
    }
    
    setLoading(true);
    setError(null);
    try {
      const results = await subjectService.searchSubjects(searchTerm);
      setSubjects(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search subjects');
      console.error('Error searching subjects:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchSubjects]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    loading,
    error,
    successMessage,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    searchSubjects,
    clearError,
    clearSuccessMessage: () => setSuccessMessage(null),
  };
};