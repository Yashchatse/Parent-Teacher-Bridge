"use client"

import apiClient from "./apiClient"
import type { PerformanceRecord } from "../types"

// Reuse helpers from other services to avoid duplication
export interface StudentItem { StudentId: number; Name: string }
export interface SubjectItem { subjectId: number; name: string }

// GET /teacher/Teachers/{teacherId}/performance
export async function fetchPerformancesByTeacher(teacherId: number): Promise<PerformanceRecord[]> {
  const res = await apiClient.get<any[]>(`/teacher/Teachers/${teacherId}/performance`)
  const list = res.data || []
  return list.map((p: any) => ({
    PerformanceId: p?.PerformanceId ?? p?.performanceId ?? p?.Id ?? p?.id,
    StudentId: p?.StudentId ?? p?.studentId ?? null,
    TeacherId: p?.TeacherId ?? p?.teacherId ?? null,
    SubjectId: p?.SubjectId ?? p?.subjectId ?? null,
    ExamType: p?.ExamType ?? p?.examType ?? null,
    MarksObtained: p?.MarksObtained ?? p?.marksObtained ?? null,
    MaxMarks: p?.MaxMarks ?? p?.maxMarks ?? null,
    Percentage: p?.Percentage ?? p?.percentage ?? null,
    Grade: p?.Grade ?? p?.grade ?? null,
    ExamDate: p?.ExamDate ?? p?.examDate ?? null,
    Remarks: p?.Remarks ?? p?.remarks ?? null,
    ...p,
  }))
}

export interface UpsertPerformanceDto {
  performanceId?: number
  studentId: number
  teacherId: number
  subjectId: number
  examType: string
  marksObtained: number
  maxMarks: number
  percentage?: number | null
  grade?: string | null
  examDate: string // yyyy-mm-dd
  remarks?: string | null
}

// POST /teacher/Teachers/performance
// DB has no autoincrement: compute last id + 1
export async function createPerformance(teacherId: number, dto: Omit<UpsertPerformanceDto, "performanceId" | "teacherId">): Promise<void> {
  const existing = await fetchPerformancesByTeacher(teacherId)
  const maxId = existing.length > 0 ? Math.max(...existing.map(x => x.PerformanceId || 0)) : 0
  const nextId = maxId + 1

  const payload: UpsertPerformanceDto = {
    performanceId: nextId,
    teacherId,
    studentId: dto.studentId,
    subjectId: dto.subjectId,
    examType: dto.examType,
    marksObtained: dto.marksObtained,
    maxMarks: dto.maxMarks,
    percentage: dto.percentage ?? null,
    grade: dto.grade ?? null,
    examDate: dto.examDate,
    remarks: dto.remarks ?? null,
  }

  try {
    await apiClient.post(`/teacher/Teachers/performance`, payload)
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // Some backends expect teacherId in the route
      await apiClient.post(`/teacher/Teachers/${teacherId}/performance`, payload)
      return
    }
    throw err
  }
}

// PUT /teacher/Teachers/{teacherId}/performance/{performanceId}
export async function updatePerformance(
  teacherId: number,
  performanceId: number,
  dto: Omit<UpsertPerformanceDto, "teacherId" | "performanceId">
): Promise<void> {
  const payload: UpsertPerformanceDto = {
    performanceId,
    teacherId,
    ...dto,
  }
  try {
    await apiClient.put(`/teacher/Teachers/${teacherId}/performance/${performanceId}`, payload)
  } catch (err: any) {
    const status = err?.response?.status
    if (status === 404) {
      // Fallback: some backends omit teacherId in the route and infer it from JWT
      await apiClient.put(`/teacher/Teachers/performance/${performanceId}`, payload)
      return
    }
    throw err
  }
}

// DELETE /teacher/Teachers/students/performance/{performanceId}
export async function deletePerformance(performanceId: number): Promise<void> {
  try {
    await apiClient.delete(`/teacher/Teachers/students/performance/${performanceId}`)
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // Alternative delete route sometimes used
      await apiClient.delete(`/teacher/Teachers/performance/${performanceId}`)
      return
    }
    throw err
  }
}


