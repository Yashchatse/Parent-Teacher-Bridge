"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PerformanceRecord } from "@/teacher/types"
import usePerformance from "@/teacher/hooks/usePerformance"
import { toast } from "@/hooks/use-toast"

function calcPercent(mo?: number | null, mm?: number | null): number | null {
  if (mo == null || mm == null || mm === 0) return null
  return Math.round((mo / mm) * 10000) / 100
}

function grade(p?: number | null): string | null {
  if (p == null) return null
  if (p >= 90) return "A+"
  if (p >= 80) return "A"
  if (p >= 70) return "B+"
  if (p >= 60) return "B"
  if (p >= 50) return "C+"
  if (p >= 40) return "C"
  if (p >= 36) return "D"
  return "F"
}

export default function PerformancePage() {
  const { teacherId, items, students, subjects, isLoading, create, update, remove, refetch } = usePerformance()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  const [form, setForm] = useState({
    studentId: 0,
    subjectId: 0,
    examType: "",
    marksObtained: 0,
    maxMarks: 100,
    percentage: null as number | null,
    grade: null as string | null,
    examDate: new Date().toISOString().slice(0, 10),
    remarks: "",
  })

  const EXAM_TYPES = useMemo(() => [
    "Practical",
    "Quiz",
    "Unit Test",
    "Final",
    "Midterm",
  ], [])

  const studentNameById = useMemo(() => {
    const map = new Map<number, string>()
    students.forEach(s => map.set(s.StudentId, s.Name))
    return map
  }, [students])

  const subjectNameById = useMemo(() => {
    const map = new Map<number, string>()
    subjects.forEach(s => map.set(s.subjectId, s.name))
    return map
  }, [subjects])

  useEffect(() => {
    // Reset to first page when items change
    setPage(1)
  }, [items.length])

  const recompute = (mo: number | null | undefined, mm: number | null | undefined) => {
    const p = calcPercent(mo ?? null, mm ?? null)
    return { percentage: p, grade: grade(p) }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      studentId: students[0]?.StudentId ?? 0,
      subjectId: subjects[0]?.subjectId ?? 0,
      examType: EXAM_TYPES[0] ?? "",
      marksObtained: 0,
      maxMarks: 100,
      percentage: null,
      grade: null,
      examDate: new Date().toISOString().slice(0, 10),
      remarks: "",
    })
    setIsModalOpen(true)
  }

  const openEdit = (rec: PerformanceRecord) => {
    setEditingId(rec.PerformanceId)
    setForm({
      studentId: rec.StudentId ?? 0,
      subjectId: rec.SubjectId ?? 0,
      examType: rec.ExamType ?? "",
      marksObtained: rec.MarksObtained ?? 0,
      maxMarks: rec.MaxMarks ?? 100,
      percentage: rec.Percentage ?? null,
      grade: rec.Grade ?? null,
      examDate: (rec.ExamDate ?? new Date().toISOString().slice(0, 10)).slice(0, 10),
      remarks: rec.Remarks ?? "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherId) return
    if (!form.studentId || !form.subjectId || !form.examType) return

    const dto = {
      studentId: form.studentId,
      subjectId: form.subjectId,
      examType: form.examType,
      marksObtained: form.marksObtained,
      maxMarks: form.maxMarks,
      percentage: form.percentage,
      grade: form.grade,
      examDate: form.examDate.slice(0, 10),
      remarks: form.remarks || null,
    }

    if (editingId) {
      await update(editingId, dto)
      toast("Updated", "Performance record updated successfully.")
    } else {
      await create(dto)
      toast("Saved", "Performance record saved successfully.")
    }

    await refetch()
    setIsModalOpen(false)
  }

  const confirmAndRemove = async (performanceId: number) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Are you sure you want to delete this performance record?")
      if (!ok) return
    }
    await remove(performanceId)
    toast("Deleted", "Performance record deleted.")
  }

  const pagedItems: PerformanceRecord[] = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return items.slice(start, end)
  }, [items, page])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Performance Management</CardTitle>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} disabled={!teacherId || isLoading || students.length === 0 || subjects.length === 0}>Add Performance</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Performance" : "Add Performance"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Student</Label>
                    <Select value={String(form.studentId || "")} onValueChange={(val) => setForm((f) => ({ ...f, studentId: Number(val) }))}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {students.map(s => (
                          <SelectItem key={s.StudentId} value={String(s.StudentId)}>{s.Name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Select value={String(form.subjectId || "")} onValueChange={(val) => setForm((f) => ({ ...f, subjectId: Number(val) }))}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {subjects.map(s => (
                          <SelectItem key={s.subjectId} value={String(s.subjectId)}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Exam Type</Label>
                    <Select value={form.examType} onValueChange={(val) => setForm((f) => ({ ...f, examType: val }))}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {EXAM_TYPES.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Marks Obtained</Label>
                      <Input
                        type="number"
                        value={form.marksObtained}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          const r = recompute(value, form.maxMarks)
                          setForm((f) => ({ ...f, marksObtained: value, percentage: r.percentage, grade: r.grade }))
                        }}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label>Max Marks</Label>
                      <Input
                        type="number"
                        value={form.maxMarks}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          const r = recompute(form.marksObtained, value)
                          setForm((f) => ({ ...f, maxMarks: value, percentage: r.percentage, grade: r.grade }))
                        }}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Percentage</Label>
                      <Input disabled value={form.percentage ?? ""} className="bg-white" />
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <Input disabled value={form.grade ?? ""} className="bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Exam Date</Label>
                      <Input
                        type="date"
                        value={form.examDate}
                        onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value.slice(0, 10) }))}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label>Remarks</Label>
                      <Input
                        value={form.remarks}
                        onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="submit">{editingId ? "Update" : "Save"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-gray-900">Performance Records</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.map((x) => (
                <TableRow key={x.PerformanceId}>
                  <TableCell>{x.PerformanceId}</TableCell>
                  <TableCell>{studentNameById.get(x.StudentId ?? 0) ?? x.StudentId ?? ""}</TableCell>
                  <TableCell>{subjectNameById.get(x.SubjectId ?? 0) ?? x.SubjectId ?? ""}</TableCell>
                  <TableCell>{x.ExamType}</TableCell>
                  <TableCell>{(x.MarksObtained ?? "").toString()}/{(x.MaxMarks ?? "").toString()}</TableCell>
                  <TableCell>{x.Percentage ?? ""}</TableCell>
                  <TableCell>{x.Grade ?? ""}</TableCell>
                  <TableCell>{(x.ExamDate ?? "").slice(0, 10)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(x)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => confirmAndRemove(x.PerformanceId)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  )
}

