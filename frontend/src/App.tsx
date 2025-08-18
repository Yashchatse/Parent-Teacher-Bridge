"use client";

import React, { useState, useEffect } from 'react';
import Login from './components/login';
import DashboardPage from './pages/dashboard';
import ParentDashboard from './parent/components/ParentDashboard';
import ParentLogin from './parent/components/Login';
import Register from './parent/components/Register';
import TeacherLogin from './teacher/components/TeacherLogin';
import RoleSelection from './components/RoleSelection';
import { ThemeProvider } from './components/theme-provider';
import { ToastProvider } from './components/toast-provider';
import { ParentAuthProvider } from './context/ParentAuthContext';
import { loginService } from './services/loginService';
import { parentService } from './services/parentService';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'roleSelection' | 'adminLogin' | 'teacherLogin' | 'parentLogin' | 'parentRegister'>('roleSelection');

  // Check if user is already authenticated on app load
  useEffect(() => {
    // For now, always start with role selection page
    // Comment out authentication checks to ensure role selection shows first
    
    // Uncomment these lines if you want to restore auto-login functionality:
    /*
    // Check for admin authentication
    if (loginService.isAuthenticated()) {
      const userData = loginService.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
    } 
    // Check for parent authentication
    else if (parentService.isAuthenticated()) {
      const userData = parentService.getCurrentUser();
      if (userData) {
        setUser({ ...userData, role: 'parent' });
        setIsLoggedIn(true);
      }
    }
    // Check for parent auth in localStorage
    else {
      const parentAuth = localStorage.getItem('parent_auth');
      if (parentAuth) {
        try {
          const parentData = JSON.parse(parentAuth);
          setUser({ ...parentData, role: 'parent' });
          setIsLoggedIn(true);
        } catch (error) {
          localStorage.removeItem('parent_auth');
        }
      }
    }
    */
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (user?.role === 'parent') {
      parentService.logout();
    } else {
      loginService.logout();
    }
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('roleSelection');
  };

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case 'admin':
        setCurrentPage('adminLogin');
        break;
      case 'teacher':
        setCurrentPage('teacherLogin');
        break;
      case 'parent':
        setCurrentPage('parentRegister');
        break;
      default:
        setCurrentPage('roleSelection');
    }
  };

  const handleBackToRoleSelection = () => {
    setCurrentPage('roleSelection');
  };

  const handleSwitchToParentLogin = () => {
    setCurrentPage('parentLogin');
  };

  const handleSwitchToParentRegister = () => {
    setCurrentPage('parentRegister');
  };

  const renderDashboard = () => {
    if (user?.role === 'parent') {
      return <ParentDashboard />;
    } else {
      return <DashboardPage onLogout={handleLogout} user={user} />;
    }
  };

  const renderCurrentPage = () => {
    if (isLoggedIn) {
      return renderDashboard();
    }

    switch (currentPage) {
      case 'roleSelection':
        return <RoleSelection onRoleSelect={handleRoleSelection} />;
      case 'adminLogin':
        return <Login onLogin={handleLogin} onBack={handleBackToRoleSelection} />;
      case 'teacherLogin':
        return <TeacherLogin onLogin={handleLogin} onBack={handleBackToRoleSelection} />;
      case 'parentLogin':
        return <ParentLogin onLogin={handleLogin} onBack={handleBackToRoleSelection} onSwitchToRegister={handleSwitchToParentRegister} />;
      case 'parentRegister':
        return <Register onRegister={handleLogin} onBack={handleBackToRoleSelection} onSwitchToLogin={handleSwitchToParentLogin} />;
      default:
        return <RoleSelection onRoleSelect={handleRoleSelection} />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <ParentAuthProvider>
          {renderCurrentPage()}
        </ParentAuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
