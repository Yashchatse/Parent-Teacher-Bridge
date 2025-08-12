"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, CheckSquare, LineChart, ShieldAlert, CalendarRange, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const items = [
  { href: "/teacher", label: "Dashboard", icon: Home },
  { href: "/teacher/profile", label: "Profile", icon: User },
  { href: "/teacher/attendance", label: "Attendance", icon: CheckSquare },
  { href: "/teacher/performance", label: "Performance", icon: LineChart },
  { href: "/teacher/behaviour", label: "Behaviour", icon: ShieldAlert },
  { href: "/teacher/timetable", label: "Timetable", icon: CalendarRange },
  { href: "/teacher/events", label: "Events", icon: CalendarDays },
]

export default function TeacherSidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 w-64 z-40">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Teacher</h1>
      </div>
      <nav className="p-4 space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button
              variant={pathname === href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                pathname === href && "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="ml-2">{label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
