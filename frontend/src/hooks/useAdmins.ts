import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

interface Admin {
  adminId: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  status: string;
  createdDate?: string;
}

export const useAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all admins
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admins');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new admin
  const createAdmin = useCallback(async (adminData: Partial<Admin>) => {
    setLoading(true);
    setError(null);
    try {
      const newAdmin = await adminService.createAdmin(adminData);
      setAdmins(prev => [...prev, newAdmin]);
      return newAdmin;
    } catch (err: any) {
      setError(err.message || 'Failed to create admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update admin
  const updateAdmin = useCallback(async (id: number, adminData: Partial<Admin>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAdmin = await adminService.updateAdmin(id, adminData);
      setAdmins(prev => prev.map(admin => 
        admin.adminId === id ? updatedAdmin : admin
      ));
      return updatedAdmin;
    } catch (err: any) {
      setError(err.message || 'Failed to update admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete admin
  const deleteAdmin = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.deleteAdmin(id);
      setAdmins(prev => prev.filter(admin => admin.adminId !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get admin by ID
  const getAdminById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const admin = await adminService.getAdminById(id);
      return admin;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search admins
  const searchAdmins = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await adminService.searchAdmins(searchTerm);
      setAdmins(results);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to search admins');
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
    fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    searchAdmins,
    clearError
  };
}; 