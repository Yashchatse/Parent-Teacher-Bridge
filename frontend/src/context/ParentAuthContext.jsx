"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { parentService } from '../services/parentService';

const ParentAuthContext = createContext(null);

export function ParentAuthProvider({ children }) {
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for parent auth in localStorage
        const parentAuth = localStorage.getItem('parent_auth');
        if (parentAuth) {
          const parentData = JSON.parse(parentAuth);
          setParent(parentData);
        } else if (parentService.isAuthenticated()) {
          // Check for general auth token and user data
          const userData = parentService.getCurrentUser();
          if (userData && userData.role === 'parent') {
            setParent(userData);
          }
        }
      } catch (error) {
        console.error('Error initializing parent auth:', error);
        // Clear corrupted data
        localStorage.removeItem('parent_auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await parentService.loginParent(email, password);
      
      if (response && response.parent) {
        const parentData = response.parent;
        setParent(parentData);
        localStorage.setItem('parent_auth', JSON.stringify(parentData));
        return { success: true, parent: parentData };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Parent login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setParent(null);
    localStorage.removeItem('parent_auth');
    parentService.logout();
  };

  const updateParent = (updatedParentData) => {
    setParent(updatedParentData);
    localStorage.setItem('parent_auth', JSON.stringify(updatedParentData));
  };

  const value = useMemo(() => ({
    parent,
    loading,
    login,
    logout,
    updateParent,
    isAuthenticated: !!parent
  }), [parent, loading]);

  return (
    <ParentAuthContext.Provider value={value}>
      {children}
    </ParentAuthContext.Provider>
  );
}

export function useParentAuth() {
  const context = useContext(ParentAuthContext);
  if (!context) {
    throw new Error('useParentAuth must be used within ParentAuthProvider');
  }
  return context;
}

export default ParentAuthContext;
