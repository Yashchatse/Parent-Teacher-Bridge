"use client"

import apiClient from "./apiClient"
import type { AttendanceRecord } from "../types"

export type StatusOption = "Late" | "Leave" | "Absent" | "Present"

export interface UpsertAttendanceDto {
  studentId: number
  classId?: number | null
  date: string // yyyy-mm-dd
  isPresent: boolean
  status?: StatusOption | string | null
  remarks?: string | null
}

type CreateAttendancePayload = UpsertAttendanceDto & { attendanceId: number }

async function getNextAttendanceId(teacherId: number): Promise<number> {
  // Aggregate across all students (and optionally classes) to find max id
  try {
    const studentsRes = await apiClient.get<any[]>(`/teacher/Teachers/${teacherId}/students`)
    const students = Array.isArray(studentsRes.data) ? studentsRes.data : []
    const studentIds: number[] = students
      .map((s: any) => s?.StudentId ?? s?.studentId ?? s?.Id ?? s?.id)
      .map((v: any) => Number(v))
      .filter((n: number) => !isNaN(n))

    // Limit concurrency to avoid overwhelming the backend
    const batchSize = 5
    const attendanceLists: any[][] = []
    for (let i = 0; i < studentIds.length; i += batchSize) {
      const batch = studentIds.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(async (sid) => {
          try {
            const res = await apiClient.get<any[]>(`/teacher/Teachers/student/${sid}/attendance`)
            return Array.isArray(res.data) ? res.data : []
          } catch {
            return []
          }
        })
      )
      attendanceLists.push(...results)
    }
    const flat = attendanceLists.flat()
    const ids = flat
      .map((a: any) => a?.AttendanceId ?? a?.attendanceId ?? a?.Id ?? a?.id)
      .filter((v: any) => v != null)
      .map((v: any) => Number(v))
      .filter((n: number) => !isNaN(n))
    const maxId = ids.length > 0 ? Math.max(...ids) : 0
    return maxId + 1
  } catch {
    return 1
  }
}

export interface AttendanceStudentItem {
  StudentId: number
  ClassId: number | null
  Name?: string
}

export async function fetchAttendanceByTeacher(teacherId: number): Promise<AttendanceRecord[]> {
  // Aggregate attendance by fetching per-student lists
  try {
    const studentsRes = await apiClient.get<any[]>(`/teacher/Teachers/${teacherId}/students`)
    const students = Array.isArray(studentsRes.data) ? studentsRes.data : []
    const studentIds: number[] = students
      .map((s: any) => s?.StudentId ?? s?.studentId ?? s?.Id ?? s?.id)
      .map((v: any) => Number(v))
      .filter((n: number) => !isNaN(n))

    // Limit concurrency
    const batchSize = 5
    const attendanceLists: any[][] = []
    for (let i = 0; i < studentIds.length; i += batchSize) {
      const batch = studentIds.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(async (sid) => {
          try {
            const res = await apiClient.get<any[]>(`/teacher/Teachers/student/${sid}/attendance`)
            return Array.isArray(res.data) ? res.data : []
          } catch {
            return []
          }
        })
      )
      attendanceLists.push(...results)
    }
    const flat = attendanceLists.flat()
    return flat.map((a: any) => ({
      AttendanceId: a?.AttendanceId ?? a?.attendanceId ?? a?.Id ?? a?.id,
      StudentId: a?.StudentId ?? a?.studentId,
      ClassId: a?.ClassId ?? a?.classId ?? 0,
      Date: (a?.Date ?? a?.date ?? "").slice(0, 10),
      IsPresent: a?.IsPresent ?? a?.isPresent ?? false,
      Status: a?.Status ?? a?.status ?? null,
      Remarks: a?.Remarks ?? a?.remarks ?? "",
      MarkedTime: a?.MarkedTime ?? a?.markedTime ?? null,
      ...a,
    }))
  } catch {
    return []
  }
}

// Fetch students and their class for marking UI
export async function fetchStudentsForAttendance(teacherId: number): Promise<AttendanceStudentItem[]> {
  const res = await apiClient.get<any[]>(`/teacher/Teachers/${teacherId}/students`)
  const list = Array.isArray(res.data) ? res.data : []
  return list.map((s: any) => ({
    StudentId: s?.StudentId ?? s?.studentId ?? s?.Id ?? s?.id,
    ClassId: s?.ClassId ?? s?.classId ?? null,
    Name: (
      s?.Name ??
      s?.name ??
      ("" + (s?.FirstName ?? "") + " " + (s?.LastName ?? "")).trim()
    ) || String(s?.StudentId ?? s?.studentId ?? ""),
  }))
}

export async function createAttendance(teacherId: number, dto: UpsertAttendanceDto, explicitId?: number): Promise<void> {
  const computed = explicitId ?? (await getNextAttendanceId(teacherId))
  const nextId = computed && computed > 0 ? computed : 1
  // Ensure classId exists and is valid (backend FK requires existing class)
  const classId = dto.classId && dto.classId > 0 ? dto.classId : null
  const pascalPayload: any = {
    AttendanceId: nextId,
    // TeacherId is optional per backend; include if model has it
    TeacherId: teacherId,
    StudentId: dto.studentId,
    ClassId: classId,
    Date: dto.date,
    IsPresent: dto.isPresent,
    Status: dto.status ?? null,
    Remarks: dto.remarks ?? null,
  }
  try {
    // Prefer PascalCase first to match backend DTO
    await apiClient.post(`/teacher/Teachers/${teacherId}/attendance`, pascalPayload)
  } catch (err: any) {
    // Retry with camelCase if needed
    const camelPayload: any = { attendanceId: nextId, teacherId, ...dto, classId }
    await apiClient.post(`/teacher/Teachers/${teacherId}/attendance`, camelPayload)
  }
}

export async function updateAttendance(attendanceId: number, dto: UpsertAttendanceDto): Promise<void> {
  const classId = dto.classId && dto.classId > 0 ? dto.classId : null
  const camelPayload: any = { attendanceId, ...dto, classId }
  const pascalPayload: any = {
    AttendanceId: attendanceId,
    StudentId: dto.studentId,
    ClassId: classId,
    Date: dto.date,
    IsPresent: dto.isPresent,
    Status: dto.status ?? null,
    Remarks: dto.remarks ?? null,
  }
  try {
    await apiClient.put(`/teacher/Teachers/attendance/${attendanceId}`, camelPayload)
  } catch (err: any) {
    if (err?.response?.status === 400) {
      await apiClient.put(`/teacher/Teachers/attendance/${attendanceId}`, pascalPayload)
      return
    }
    throw err
  }
}

export async function deleteAttendance(attendanceId: number): Promise<void> {
  try {
    await apiClient.delete(`/teacher/Teachers/attendance/${attendanceId}`)
  } catch (err: any) {
    throw err
  }
}


