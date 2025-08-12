"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { AdminManagement } from "@/components/admin-management"
import { TeacherManagement } from "@/components/teacher-management"
import { ClassManagement } from "@/components/class-management"
import { StudentManagement } from "@/components/student-management"
import { SubjectManagement } from "@/components/subject-management"
import TimetableManagement from "@/components/timetable-management"
import { Settings } from "@/components/settings"
import { AnalyticsPage } from "@/components/analytics-page"
import Login from "@/components/login"
import RoleSelection from "@/components/RoleSelection"
import ParentLogin from "@/parent/components/Login"
import Register from "@/parent/components/Register"
import TeacherLogin from "@/teacher/components/TeacherLogin"
import ParentDashboard from "@/parent/components/ParentDashboard"
import { ParentAuthProvider } from "@/context/ParentAuthContext"
import { loginService } from "@/services/loginService"
import { parentService } from "@/services/parentService"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<'roleSelection' | 'adminLogin' | 'teacherLogin' | 'parentLogin' | 'parentRegister'>('roleSelection')
  const [isHydrated, setIsHydrated] = useState(false)

  // Check if user is already authenticated on app load
  useEffect(() => {
    // Set hydrated to true after component mounts to prevent hydration mismatch
    setIsHydrated(true);
    
    // For now, always start with role selection page
    // Comment out authentication checks to ensure role selection shows first
    
    // Uncomment these lines if you want to restore auto-login functionality:
    /*
    if (loginService.isAuthenticated()) {
      const userData = loginService.getCurrentUser()
      setUser(userData)
      setIsLoggedIn(true)
    }
    // Check for parent authentication
    else if (parentService.isAuthenticated()) {
      const userData = parentService.getCurrentUser();
      if (userData) {
        setUser({ ...userData, role: 'parent' });
        setIsLoggedIn(true);
      }
    }
    */
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    if (user?.role === 'parent') {
      parentService.logout();
    } else {
      loginService.logout();
    }
    setUser(null)
    setIsLoggedIn(false)
    setCurrentPage('roleSelection')
  }

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case 'admin':
        setCurrentPage('adminLogin');
        break;
      case 'teacher':
        router.push('/teacher');
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

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent onLogout={handleLogout} user={user} />
      case "analytics":
        return <AnalyticsPage />
      case "admins":
        return <AdminManagement />
      case "teachers":
        return <TeacherManagement />
      case "classes":
        return <ClassManagement />
      case "students":
        return <StudentManagement />
      case "subjects":
        return <SubjectManagement />
      case "timetables":
        return <TimetableManagement />
      case "settings":
        return <Settings />
      default:
        return <DashboardContent onLogout={handleLogout} user={user} />
    }
  }

  const renderDashboard = () => {
    if (user?.role === 'parent') {
      return <ParentDashboard onLogout={handleLogout} />;
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-350 via-purple-400 to-blue-200">
          <div className="flex">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="flex-1 ml-64">
              <div className="p-6">{renderContent()}</div>
            </main>
          </div>
        </div>
      );
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
        return <ParentLogin onSuccess={handleLogin} onRegister={handleLogin} onLogin={handleLogin} onBack={handleBackToRoleSelection} onSwitchToRegister={handleSwitchToParentRegister} />;
      case 'parentRegister':
        return <Register onSuccess={handleLogin} onRegister={handleLogin} onBack={handleBackToRoleSelection} onSwitchToLogin={handleSwitchToParentLogin} />;
      default:
        return <RoleSelection onRoleSelect={handleRoleSelection} />;
    }
  };

  // Show loading state until hydration is complete to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ParentAuthProvider>
      {renderCurrentPage()}
    </ParentAuthProvider>
  );
}

