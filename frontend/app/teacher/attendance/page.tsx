"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAttendance from "@/teacher/hooks/useAttendance"
import { toast } from "@/hooks/use-toast"

export default function AttendancePage() {
  const { teacherId, items, students, isLoading, create, update, remove, refetch, STATUS_OPTIONS } = useAttendance()
  const [isMarking, setIsMarking] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const studentNameById = useMemo(() => {
    const map = new Map<number, string>()
    students.forEach(s => map.set(s.StudentId, s.Name))
    return map
  }, [students])

  useEffect(() => { setPage(1) }, [items.length])

  const today = new Date().toISOString().slice(0, 10)
  type RowForm = { attendanceId?: number; studentId: number; date: string; isPresent: boolean; status: string; remarks: string; classId?: number | null }
  const [rowEdits, setRowEdits] = useState<Record<number, RowForm>>({})

  // Initialize per-student row for easy marking
  useEffect(() => {
    const next: Record<number, RowForm> = {}
    students.forEach(s => {
      next[s.StudentId] = {
        studentId: s.StudentId,
        date: today,
        isPresent: true,
        status: "Present",
        remarks: "",
        classId: s.ClassId ?? null,
      }
    })
    setRowEdits(next)
  }, [students])

  const handleChange = (studentId: number, patch: Partial<RowForm>) => {
    setRowEdits(prev => ({ ...prev, [studentId]: { ...prev[studentId], ...patch } }))
  }

  const handleSave = async (studentId: number) => {
    const r = rowEdits[studentId]
    if (!teacherId || !r) return
    const dto = {
      studentId: r.studentId,
      classId: r.classId ?? null,
      date: r.date.slice(0, 10),
      isPresent: r.isPresent,
      status: r.status,
      remarks: r.remarks,
    }
    await create(dto)
    toast("Saved", `Attendance saved for ${studentNameById.get(studentId) ?? studentId}`)
  }

  const handleUpdate = async (attendanceId: number, studentId: number) => {
    const r = rowEdits[studentId]
    if (!r) return
    const dto = {
      studentId: r.studentId,
      classId: r.classId ?? null,
      date: r.date.slice(0, 10),
      isPresent: r.isPresent,
      status: r.status,
      remarks: r.remarks,
    }
    await update(attendanceId, dto)
    toast("Updated", `Attendance updated for ${studentNameById.get(studentId) ?? studentId}`)
  }

  const confirmAndRemove = async (attendanceId: number) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Delete this attendance record?")
      if (!ok) return
    }
    await remove(attendanceId)
    toast("Deleted", "Attendance record deleted.")
  }

  // Build latest attendance by student (assume last entry per student is latest)
  const latestByStudent = useMemo(() => {
    const map = new Map<number, { rec: typeof items[number]; idx: number }>()
    items.forEach((rec, idx) => {
      if (!map.has(rec.StudentId)) map.set(rec.StudentId, { rec, idx })
      else {
        const existing = map.get(rec.StudentId)!
        if (new Date(rec.Date) > new Date(existing.rec.Date)) map.set(rec.StudentId, { rec, idx })
      }
    })
    return map
  }, [items])

  const visibleStudents = useMemo(() => {
    const start = (page - 1) * pageSize
    return students.slice(start, start + pageSize)
  }, [students, page])

  const totalPages = Math.max(1, Math.ceil(students.length / pageSize))

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Mark Attendance</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStudents.map((s) => {
                const latest = latestByStudent.get(s.StudentId)?.rec
                const attendanceId = latest?.AttendanceId
                const r = rowEdits[s.StudentId]
                return (
                  <TableRow key={s.StudentId}>
                    <TableCell className="font-medium">{s.Name}</TableCell>
                    <TableCell className="min-w-[140px]">
                      <Input type="date" value={r?.date ?? today} onChange={(e) => handleChange(s.StudentId, { date: e.target.value })} className="bg-white" />
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <Button variant={r?.isPresent ? "default" : "outline"} onClick={() => handleChange(s.StudentId, { isPresent: true, status: "Present" })}>Present</Button>
                        <Button variant={!r?.isPresent ? "default" : "outline"} onClick={() => handleChange(s.StudentId, { isPresent: false, status: "Absent" })}>Absent</Button>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <Select value={r?.status ?? "Present"} onValueChange={(val) => handleChange(s.StudentId, { status: val })}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input value={r?.remarks ?? ""} onChange={(e) => handleChange(s.StudentId, { remarks: e.target.value })} className="bg-white" />
                    </TableCell>
                    <TableCell className="space-x-2 min-w-[180px]">
                      {attendanceId ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleUpdate(attendanceId, s.StudentId)}>Update</Button>
                          <Button size="sm" variant="destructive" onClick={() => confirmAndRemove(attendanceId)}>Delete</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleSave(s.StudentId)}>Save</Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="space-x-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-gray-900">Attendance History</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((x) => (
                <TableRow key={x.AttendanceId}>
                  <TableCell>{x.AttendanceId}</TableCell>
                  <TableCell>{studentNameById.get(x.StudentId) ?? x.StudentId}</TableCell>
                  <TableCell>{(x.Date ?? "").slice(0, 10)}</TableCell>
                  <TableCell>{x.IsPresent ? "Yes" : "No"}</TableCell>
                  <TableCell>{x.Status ?? ""}</TableCell>
                  <TableCell>{x.Remarks ?? ""}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      // Load into row edits for quick update
                      handleChange(x.StudentId, {
                        attendanceId: x.AttendanceId,
                        studentId: x.StudentId,
                        date: (x.Date ?? "").slice(0, 10),
                        isPresent: !!x.IsPresent,
                        status: x.Status ?? "",
                        remarks: x.Remarks ?? "",
                        classId: x.ClassId ?? 0,
                      })
                      toast("Loaded", "Loaded into marking row above for editing.")
                    }}>Load</Button>
                    <Button size="sm" variant="destructive" onClick={() => confirmAndRemove(x.AttendanceId)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
