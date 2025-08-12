"use client"

import { useState } from "react"
import {
  Home,
  Users,
  GraduationCap,
  School,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  BarChart3,
} from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  // { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
  { id: "admins", label: "Admin Management", icon: UserCheck },
  { id: "teachers", label: "Teacher Management", icon: GraduationCap },
  { id: "classes", label: "Class Management", icon: School },
  { id: "students", label: "Student Management", icon: Users },
  { id: "subjects", label: "Subject Management", icon: BookOpen },
  { id: "timetables", label: "Timetable Management", icon: Calendar },
  // { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold text-white">School Admin</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                activeSection === item.id && "bg-blue-600 text-white hover:bg-blue-700",
                collapsed && "px-2",
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          )
        })}
      </nav>

    </div>
  )
}
