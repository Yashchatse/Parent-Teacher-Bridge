"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getCurrentTeacher } from "@/teacher/auth"
import { fetchStudentsForAttendance } from "@/teacher/services/attendanceService"
import type { AttendanceRecord } from "@/teacher/types"
import {
  createAttendance,
  deleteAttendance,
  fetchAttendanceByTeacher,
  updateAttendance,
  type UpsertAttendanceDto,
  type StatusOption,
} from "@/teacher/services/attendanceService"

export interface UseAttendanceResult {
  teacherId: number | null
  items: AttendanceRecord[]
  students: { StudentId: number; Name: string; ClassId: number | null }[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (dto: UpsertAttendanceDto) => Promise<void>
  update: (attendanceId: number, dto: UpsertAttendanceDto) => Promise<void>
  remove: (attendanceId: number) => Promise<void>
  STATUS_OPTIONS: StatusOption[]
}

export default function useAttendance(): UseAttendanceResult {
  const [teacherId, setTeacherId] = useState<number | null>(null)
  const [items, setItems] = useState<AttendanceRecord[]>([])
  const [students, setStudents] = useState<{ StudentId: number; Name: string; ClassId: number | null }[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const STATUS_OPTIONS: StatusOption[] = useMemo(() => [
    "Late", "Leave", "Absent", "Present"
  ], [])

  useEffect(() => {
    const auth = getCurrentTeacher()
    setTeacherId(auth?.teacherId ?? null)
  }, [])

  const refetch = useCallback(async () => {
    if (!teacherId) return
    setIsLoading(true)
    setError(null)
    try {
      const [studentList, attendanceList] = await Promise.all([
        fetchStudentsForAttendance(teacherId),
        fetchAttendanceByTeacher(teacherId),
      ])
      // Ensure required fields and keep ClassId for FK
      setStudents(studentList.map(s => ({
        StudentId: s.StudentId,
        Name: s.Name ?? "",
        ClassId: s.ClassId ?? null,
      })))
      setItems(attendanceList)
    } catch (e: any) {
      setError(e?.message ?? "Failed to load attendance")
    } finally {
      setIsLoading(false)
    }
  }, [teacherId])

  useEffect(() => {
    if (teacherId) void refetch()
  }, [teacherId, refetch])

  const create = useCallback(async (dto: UpsertAttendanceDto) => {
    if (!teacherId) return
    // If the backend rejects because of duplicate PK, try with a bumped id
    try {
      await createAttendance(teacherId, dto)
    } catch (e: any) {
      // Fallback: try a few higher IDs
      for (let bump = 2; bump <= 5; bump++) {
        try {
          await createAttendance(teacherId, dto, bump)
          break
        } catch (err) {
          if (bump === 5) throw e
        }
      }
    }
    await refetch()
  }, [teacherId, refetch])

  const update = useCallback(async (attendanceId: number, dto: UpsertAttendanceDto) => {
    await updateAttendance(attendanceId, dto)
    await refetch()
  }, [refetch])

  const remove = useCallback(async (attendanceId: number) => {
    await deleteAttendance(attendanceId)
    await refetch()
  }, [refetch])

  return { teacherId, items, students, isLoading, error, refetch, create, update, remove, STATUS_OPTIONS }
}


