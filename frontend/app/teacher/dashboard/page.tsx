"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useTeacherProfile from "@/teacher/hooks/useTeacherProfile"
import { useTeacherTimetable } from "@/teacher/hooks/useTeacherTimetable"
import useAttendance from "@/teacher/hooks/useAttendance"
import usePerformance from "@/teacher/hooks/usePerformance"
import useEvents from "@/teacher/hooks/useEvents"
import useBehaviour from "@/teacher/hooks/useBehaviour"

function getTodayWeekday(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[new Date().getDay()]
}

export default function TeacherDashboardPage() {
  const { profile } = useTeacherProfile()
  const { items: timetableItems, loading: timetableLoading, getSubjectName, getClassName } = useTeacherTimetable()
  const { students, items: attendanceItems, isLoading: attendanceLoading } = useAttendance()
  const { items: performanceItems, isLoading: performanceLoading } = usePerformance()
  const { events, isLoading: eventsLoading } = useEvents()
  const { behaviours, isLoading: behaviourLoading } = useBehaviour()

  const [today] = useState<string>(new Date().toISOString().slice(0, 10))

  const todayWeekday = getTodayWeekday()
  const todaysSchedule = useMemo(() => {
    const list = (timetableItems || []).filter((x: any) => {
      const wd = x.weekday ?? x.Weekday
      return (wd || "").toString().toLowerCase() === todayWeekday.toLowerCase()
    })
    // sort by startTime
    list.sort((a: any, b: any) => (a.startTime || "").localeCompare(b.startTime || ""))
    return list
  }, [timetableItems, todayWeekday])

  const upcomingEvents = useMemo(() => {
    const now = new Date(today)
    return (events || [])
      .filter((e) => {
        const d = e.EventDate
        if (!d) return false
        try { return new Date(d) >= now } catch { return false }
      })
      .slice(0, 5)
  }, [events, today])

  const recentPerformances = useMemo(() => {
    const list = [...(performanceItems || [])]
    list.sort((a, b) => (b.PerformanceId || 0) - (a.PerformanceId || 0))
    return list.slice(0, 5)
  }, [performanceItems])

  const recentBehaviours = useMemo(() => {
    const list = [...(behaviours || [])]
    list.sort((a: any, b: any) => (new Date(b.IncidentDate).getTime() - new Date(a.IncidentDate).getTime()))
    return list.slice(0, 5)
  }, [behaviours])

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Teacher Dashboard</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Hi {profile?.Name || profile?.name || "Teacher"}, here is your overview.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/teacher/profile"><Button variant="outline">Profile</Button></Link>
              <Link href="/teacher/timetable"><Button variant="outline">Timetable</Button></Link>
              <Link href="/teacher/attendance"><Button variant="outline">Attendance</Button></Link>
              <Link href="/teacher/performance"><Button variant="outline">Performance</Button></Link>
              <Link href="/teacher/events"><Button variant="outline">Events</Button></Link>
              <Link href="/teacher/behaviour"><Button variant="outline">Behaviour</Button></Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-gray-200">
              <CardHeader><CardTitle className="text-gray-900 text-sm">Students</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-semibold text-gray-900">{students.length}</div></CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader><CardTitle className="text-gray-900 text-sm">Attendance Records</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-semibold text-gray-900">{attendanceItems.length}</div></CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader><CardTitle className="text-gray-900 text-sm">Performance Records</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-semibold text-gray-900">{performanceItems.length}</div></CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader><CardTitle className="text-gray-900 text-sm">Upcoming Events</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</div></CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900">Today's Timetable ({todayWeekday})</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetableLoading ? (
                    <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
                  ) : todaysSchedule.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-500">No classes today</TableCell></TableRow>
                  ) : (
                    todaysSchedule.map((it: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{(it.startTime || "").slice(0,5)} - {(it.endTime || "").slice(0,5)}</TableCell>
                        <TableCell>{getSubjectName(it.subjectId ?? it.SubjectId ?? undefined)}</TableCell>
                        <TableCell>{getClassName(it.classId ?? it.ClassId ?? undefined)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900">Upcoming Events</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsLoading ? (
                    <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
                  ) : upcomingEvents.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-500">No upcoming events</TableCell></TableRow>
                  ) : (
                    upcomingEvents.map((e, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{e.Title || "N/A"}</TableCell>
                        <TableCell>{(e.EventDate || "").slice(0,10)}</TableCell>
                        <TableCell>{e.EventType || ""}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900">Recent Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceLoading ? (
                    <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                  ) : recentPerformances.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-gray-500">No performance records</TableCell></TableRow>
                  ) : (
                    recentPerformances.map((p) => (
                      <TableRow key={p.PerformanceId}>
                        <TableCell>{p.PerformanceId}</TableCell>
                        <TableCell>{p.StudentId}</TableCell>
                        <TableCell>{p.SubjectId}</TableCell>
                        <TableCell>{p.Grade ?? ""}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-gray-900">Recent Behaviour</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {behaviourLoading ? (
                    <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                  ) : recentBehaviours.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-gray-500">No behaviour records</TableCell></TableRow>
                  ) : (
                    recentBehaviours.map((b: any) => (
                      <TableRow key={b.BehaviourId}>
                        <TableCell>{b.StudentId}</TableCell>
                        <TableCell>{b.BehaviourCategory}</TableCell>
                        <TableCell>{b.Severity}</TableCell>
                        <TableCell>{(b.IncidentDate || "").slice(0, 10)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


