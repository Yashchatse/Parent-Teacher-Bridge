"use client"

import React, { useEffect, useState } from "react"
import TeacherSidebar from "./TeacherSidebar"
import TeacherLogin from "./TeacherLogin"
import { isAuthenticated, getCurrentTeacher, logout } from "../auth"
import { Button } from "@/components/ui/button"

export default function TeacherLayoutShell({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState<{ email: string; teacherId: number } | null>(null)

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentTeacher())
      setAuthed(true)
    }
  }, [])

  const handleBackToRoleSelection = () => {
    // Redirect to the main role selection page
    window.location.href = '/'
  }

  if (!authed) {
    return <TeacherLogin 
      onLoggedIn={(u) => { setUser(u); setAuthed(true) }} 
      onBack={handleBackToRoleSelection}
    />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 ml-64">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div>
              <p className="text-gray-700">Welcome, {user?.email}</p>
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => { logout(); setAuthed(false) }}>
              Logout
            </Button>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
