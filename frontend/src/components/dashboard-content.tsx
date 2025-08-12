"use client"

import { useState, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Users, GraduationCap, School, BookOpen, LogOut, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { useDashboard } from "../hooks/useDashboard"
import { AdminManagement } from "@/components/admin-management"
import { TeacherManagement } from "@/components/teacher-management"
import { ClassManagement } from "@/components/class-management"
import { StudentManagement } from "@/components/student-management"
import { SubjectManagement } from "@/components/subject-management"
import TimetableManagement from "@/components/timetable-management"

interface DashboardContentProps {
  onLogout: () => void;
  user: { email: string; name?: string; role?: string } | null;
}

export function DashboardContent({ onLogout, user }: DashboardContentProps) {
  const [activeSection, setActiveSection] = useState<
    | "dashboard"
    | "admins"
    | "teachers"
    | "classes"
    | "students"
    | "subjects"
    | "timetables"
  >("dashboard")
  const { counts, loading, error, refreshCounts, isInitialLoad } = useDashboard()

  const stats = [
    { 
      title: "Total Admins", 
      value: counts.adminCount.toString(), 
      icon: Users, 
      color: "text-blue-400",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20"
    },
    { 
      title: "Total Teachers", 
      value: counts.teacherCount.toString(), 
      icon: GraduationCap, 
      color: "text-green-400",
      bgColor: "bg-green-600/10",
      borderColor: "border-green-600/20"
    },
    { 
      title: "Total Students", 
      value: counts.studentCount.toString(), 
      icon: Users, 
      color: "text-purple-400",
      bgColor: "bg-purple-600/10",
      borderColor: "border-purple-600/20"
    },
    { 
      title: "Total Classes", 
      value: counts.classCount.toString(), 
      icon: School, 
      color: "text-yellow-400",
      bgColor: "bg-yellow-600/10",
      borderColor: "border-yellow-600/20"
    },
    { 
      title: "Total Subjects", 
      value: counts.subjectCount.toString(), 
      icon: BookOpen, 
      color: "text-pink-400",
      bgColor: "bg-pink-600/10",
      borderColor: "border-pink-600/20"
    },
  ]

  const handleRefresh = async () => {
    try {
      await refreshCounts();
    } catch (err) {
      console.error('Failed to refresh dashboard:', err);
    }
  };

  // Render non-dashboard sections directly inside this component
  if (activeSection !== "dashboard") {
    let sectionContent: ReactNode = null
    switch (activeSection) {
      case "admins":
        sectionContent = <AdminManagement />
        break
      case "teachers":
        sectionContent = <TeacherManagement />
        break
      case "classes":
        sectionContent = <ClassManagement />
        break
      case "students":
        sectionContent = <StudentManagement />
        break
      case "subjects":
        sectionContent = <SubjectManagement />
        break
      case "timetables":
        sectionContent = <TimetableManagement />
        break
      default:
        sectionContent = null
    }

    return (
      <div className="bg-gray-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setActiveSection("dashboard")}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          {sectionContent}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900">
      <div className="p-6">
        {/* Error Display */}
        {error && (
          <Alert className="mb-6 bg-red-900/50 border-red-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400">
              Welcome back,{" "}
              <span className="text-white text-2xl font-bold">
                {user?.name || user?.email?.split("@")[0] || "User"}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:${stat.bgColor} transition-colors ${stat.borderColor}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white flex items-center">
                    {isInitialLoad && loading ? (
                      <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {loading && !isInitialLoad ? (
                      <span className="text-blue-400">Updating...</span>
                    ) : (
                      "Live count"
                    )}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Loading State for Initial Load */}
        {isInitialLoad && loading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-400 mx-auto mb-4" />
            <p className="text-gray-300">Loading dashboard data...</p>
          </div>
        )}

        {/* Quick Actions - Full Width */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setActiveSection("admins")}
                  className="bg-green-600 hover:bg-green-700 h-16 flex-col"
                  disabled={loading && isInitialLoad}
                >
                  <Users className="h-6 w-6 mb-1" />
                  Add Student
                </Button>
                <Button
                  onClick={() => setActiveSection("teachers")}
                  className="bg-blue-600 hover:bg-blue-700 h-16 flex-col"
                  disabled={loading && isInitialLoad}
                >
                  <GraduationCap className="h-6 w-6 mb-1" />
                  Add Teacher
                </Button>
                <Button
                  onClick={() => setActiveSection("classes")}
                  className="bg-purple-600 hover:bg-purple-700 h-16 flex-col"
                  disabled={loading && isInitialLoad}
                >
                  <School className="h-6 w-6 mb-1" />
                  Add Class
                </Button>
                <Button
                  onClick={() => setActiveSection("subjects")}
                  className="bg-yellow-600 hover:bg-yellow-700 h-16 flex-col"
                  disabled={loading && isInitialLoad}
                >
                  <BookOpen className="h-6 w-6 mb-1" />
                  Add Subject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Summary */}
        {!loading && !error && (
          <div className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300 text-sm">
                  <p>
                    Total entities managed: {" "}
                    <span className="text-white font-semibold">
                      {counts.adminCount + counts.teacherCount + counts.studentCount + 
                       counts.classCount + counts.subjectCount}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Data refreshes automatically every 5 minutes | Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}