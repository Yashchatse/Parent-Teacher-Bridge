"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Clock } from "lucide-react"
import { useTeacherTimetable } from "@/teacher/hooks/useTeacherTimetable"
import { normalizeTime } from "@/teacher/services/timetable"

const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function TimetablePage() {
  const {
    loading,
    error,
    items,
    classes,
    classFilter,
    setClassFilter,
    getSubjectName,
    getClassName,
    getScheduleForSlot,
    refresh,
  } = useTeacherTimetable()

  // Build dynamic time slots from fetched items (respect class filter)
  const timeSlots = useMemo(() => {
    const source = classFilter === "" ? items : items.filter((x) => Number(x.classId ?? 0) === Number(classFilter))
    const set = new Set<string>()
    for (const it of source) {
      const s = normalizeTime(it.startTime)
      const e = normalizeTime(it.endTime)
      if (s && e) set.add(`${s}-${e}`)
    }
    const arr = Array.from(set).map((str) => {
      const [s, e] = str.split("-")
      return { startTime: s, endTime: e }
    })
    // sort by start time
    arr.sort((a, b) => (a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0))
    return arr
  }, [items, classFilter])

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-indigo-600" />
            Timetable (Teacher)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Label className="text-gray-700">Filter by Class</Label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900"
              disabled={loading}
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={refresh} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <span className="ml-4 text-gray-800 text-xl">Loading timetable...</span>
        </div>
      ) : (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-200 p-3 text-gray-700 bg-gray-50">Time</th>
                    {days.map((day) => (
                      <th key={day} className="border border-gray-200 p-3 text-gray-700 bg-gray-50 min-w-[150px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={`${slot.startTime}-${slot.endTime}`}>
                      <td className="border border-gray-200 p-3 text-gray-900 bg-white font-medium">
                        {`${slot.startTime}-${slot.endTime}`}
                      </td>
                      {days.map((day) => {
                        const schedule = getScheduleForSlot(day, slot)
                        const subjectId = schedule?.subjectId ?? null
                        const classId = schedule?.classId ?? null
                        const subjectName = getSubjectName(subjectId || undefined)
                        const className = getClassName(classId || undefined)
                        return (
                          <td key={`${day}-${slot.startTime}`} className="border border-gray-200 p-2">
                            {schedule ? (
                              <div className="p-2 rounded text-gray-900 text-sm bg-indigo-50 border border-indigo-200">
                                <div className="font-medium">{subjectName}</div>
                                <div className="text-xs text-gray-700">{className}</div>
                              </div>
                            ) : (
                              <div className="h-16 flex items-center justify-center text-gray-500">Free</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
