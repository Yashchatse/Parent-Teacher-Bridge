// hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardService, DashboardCounts } from '../services/dashboardService';

export interface UseDashboardReturn {
  counts: DashboardCounts;
  loading: boolean;
  error: string | null;
  refreshCounts: () => Promise<void>;
  isInitialLoad: boolean;
}

export const useDashboard = (): UseDashboardReturn => {
  const [counts, setCounts] = useState<DashboardCounts>({
    adminCount: 0,
    teacherCount: 0,
    studentCount: 0,
    classCount: 0,
    subjectCount: 0,
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Clear error after a timeout
  const clearError = useCallback(() => {
    setTimeout(() => setError(null), 5000);
  }, []);

  // Fetch dashboard counts
  const fetchCounts = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log('Fetching dashboard counts...');
      const dashboardCounts = await dashboardService.getDashboardCounts();
      setCounts(dashboardCounts);
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard counts';
      setError(errorMessage);
      clearError();
      console.error('Dashboard fetch error:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [clearError, isInitialLoad]);

  // Refresh counts (public method)
  const refreshCounts = useCallback(async () => {
    await fetchCounts(true);
  }, [fetchCounts]);

  // Auto-refresh counts every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCounts(false); // Silent refresh
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchCounts]);

  // Initial load
  useEffect(() => {
    fetchCounts(true);
  }, [fetchCounts]);

  return {
    counts,
    loading,
    error,
    refreshCounts,
    isInitialLoad,
  };
};