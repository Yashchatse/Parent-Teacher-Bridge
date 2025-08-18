// hooks/useTimetable.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  timetableService, 
  Timetable, 
  CreateTimetableDto, 
  UpdateTimetableDto,
  SchoolClass,
  Subject,
  Teacher
} from '../services/timetableSerivce';

export interface UseTimetableReturn {
  timetables: Timetable[];
  classes: SchoolClass[];
  subjects: Subject[];
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  getAllTimetables: () => Promise<void>;
  getTimetablesByClass: (classId: number) => Promise<Timetable[]>;
  getTimetablesByTeacher: (teacherId: number) => Promise<Timetable[]>;
  getTimetablesByWeekday: (weekday: string) => Promise<Timetable[]>;
  createTimetable: (data: CreateTimetableDto) => Promise<Timetable>;
  updateTimetable: (id: number, data: UpdateTimetableDto) => Promise<void>;
  deleteTimetable: (id: number) => Promise<void>;
  checkScheduleConflict: (
    classId: number,
    teacherId: number,
    weekday: string,
    startTime: string,
    endTime: string,
    excludeTimetableId?: number
  ) => Promise<boolean>;
  refresh: () => Promise<void>;
  loadInitialData: () => Promise<void>;
}

export const useTimetable = (): UseTimetableReturn => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error after a timeout
  const clearError = useCallback(() => {
    setTimeout(() => setError(null), 8000); // Increased timeout for better visibility
  }, []);

  // Load all initial data (classes, subjects, teachers, timetables)
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading initial data...');
      
      // Load data sequentially with better error handling
      console.log('Loading classes...');
      const classesData = await timetableService.getAllClasses();
      console.log('Classes loaded:', classesData.length);
      setClasses(classesData);
      
      console.log('Loading subjects...');
      const subjectsData = await timetableService.getAllSubjects();
      console.log('Subjects loaded:', subjectsData.length);
      setSubjects(subjectsData);
      
      console.log('Loading teachers...');
      const teachersData = await timetableService.getAllTeachers();
      console.log('Teachers loaded:', teachersData.length);
      setTeachers(teachersData);
      
      console.log('Loading timetables...');
      const timetablesData = await timetableService.getAllTimetables();
      console.log('Timetables loaded:', timetablesData.length);
      setTimetables(timetablesData);
      
      console.log('All data loaded successfully');
    } catch (err) {
      console.error('Error loading initial data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load initial data';
      setError(errorMessage);
      clearError();
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Get all timetables
  const getAllTimetables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await timetableService.getAllTimetables();
      setTimetables(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch timetables';
      setError(errorMessage);
      clearError();
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Get timetables by class
  const getTimetablesByClass = useCallback(async (classId: number): Promise<Timetable[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await timetableService.getTimetablesByClass(classId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch class timetables';
      setError(errorMessage);
      clearError();
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Get timetables by teacher
  const getTimetablesByTeacher = useCallback(async (teacherId: number): Promise<Timetable[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await timetableService.getTimetablesByTeacher(teacherId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch teacher timetables';
      setError(errorMessage);
      clearError();
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Get timetables by weekday
  const getTimetablesByWeekday = useCallback(async (weekday: string): Promise<Timetable[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await timetableService.getTimetablesByWeekday(weekday);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weekday timetables';
      setError(errorMessage);
      clearError();
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Create new timetable
  const createTimetable = useCallback(async (data: CreateTimetableDto): Promise<Timetable> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Creating timetable with data:', data);
      const newTimetable = await timetableService.createTimetable(data);
      console.log('Timetable created successfully:', newTimetable);
      
      // Add the new timetable to the state
      setTimetables(prev => [...prev, newTimetable]);
      
      // Refresh the timetables to ensure we have the latest data
      await getAllTimetables();
      
      return newTimetable;
    } catch (err) {
      console.error('Error creating timetable:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create timetable';
      setError(errorMessage);
      clearError();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, getAllTimetables]);

  // Update timetable
  const updateTimetable = useCallback(async (id: number, data: UpdateTimetableDto): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await timetableService.updateTimetable(id, data);
      setTimetables(prev => 
        prev.map(t => t.timetableId === id ? { ...t, ...data } : t)
      );
      
      // Refresh to get updated data with populated fields
      await getAllTimetables();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update timetable';
      setError(errorMessage);
      clearError();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, getAllTimetables]);

  // Delete timetable
  const deleteTimetable = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await timetableService.deleteTimetable(id);
      setTimetables(prev => prev.filter(t => t.timetableId !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete timetable';
      setError(errorMessage);
      clearError();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Check schedule conflict
  const checkScheduleConflict = useCallback(async (
    classId: number,
    teacherId: number,
    weekday: string,
    startTime: string,
    endTime: string,
    excludeTimetableId?: number
  ): Promise<boolean> => {
    try {
      console.log('Checking schedule conflict:', { classId, teacherId, weekday, startTime, endTime });
      const hasConflict = await timetableService.checkScheduleConflict(
        classId,
        teacherId,
        weekday,
        startTime,
        endTime,
        excludeTimetableId
      );
      console.log('Conflict check result:', hasConflict);
      return hasConflict;
    } catch (err) {
      console.error('Error checking schedule conflict:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to check schedule conflict';
      setError(errorMessage);
      clearError();
      return false;
    }
  }, [clearError]);

  // Refresh data
  const refresh = useCallback(async () => {
    console.log('Refreshing all data...');
    await loadInitialData();
  }, [loadInitialData]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('State updated:', {
      classesCount: classes.length,
      subjectsCount: subjects.length,
      teachersCount: teachers.length,
      timetablesCount: timetables.length,
      loading,
      error
    });
  }, [classes.length, subjects.length, teachers.length, timetables.length, loading, error]);

  return {
    timetables,
    classes,
    subjects, 
    teachers,
    loading,
    error,
    getAllTimetables,
    getTimetablesByClass,
    getTimetablesByTeacher,
    getTimetablesByWeekday,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    checkScheduleConflict,
    refresh,
    loadInitialData,
  };
};