"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getCurrentTeacher } from "@/teacher/auth"
import { fetchStudentsByTeacher } from "@/teacher/services/behaviourService"
import { fetchSubjects } from "@/teacher/services/timetable"
import {
  createPerformance,
  deletePerformance,
  fetchPerformancesByTeacher,
  updatePerformance,
} from "@/teacher/services/performanceService"
import type { PerformanceRecord } from "@/teacher/types"

export interface UsePerformanceResult {
  teacherId: number | null
  items: PerformanceRecord[]
  students: { StudentId: number; Name: string }[]
  subjects: { subjectId: number; name: string }[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (
    dto: {
      studentId: number
      subjectId: number
      examType: string
      marksObtained: number
      maxMarks: number
      percentage?: number | null
      grade?: string | null
      examDate: string
      remarks?: string | null
    }
  ) => Promise<void>
  update: (
    performanceId: number,
    dto: {
      studentId: number
      subjectId: number
      examType: string
      marksObtained: number
      maxMarks: number
      percentage?: number | null
      grade?: string | null
      examDate: string
      remarks?: string | null
    }
  ) => Promise<void>
  remove: (performanceId: number) => Promise<void>
}

export default function usePerformance(): UsePerformanceResult {
  const [teacherId, setTeacherId] = useState<number | null>(null)
  const [items, setItems] = useState<PerformanceRecord[]>([])
  const [students, setStudents] = useState<{ StudentId: number; Name: string }[]>([])
  const [subjects, setSubjects] = useState<{ subjectId: number; name: string }[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getCurrentTeacher()
    setTeacherId(auth?.teacherId ?? null)
  }, [])

  const refetch = useCallback(async () => {
    if (!teacherId) return
    setIsLoading(true)
    setError(null)
    try {
      const [studentList, subjectList, performanceList] = await Promise.all([
        fetchStudentsByTeacher(teacherId),
        fetchSubjects(),
        fetchPerformancesByTeacher(teacherId),
      ])
      setStudents(studentList)
      setSubjects(subjectList)
      setItems(performanceList)
    } catch (e: any) {
      setError(e?.message ?? "Failed to load performance data")
    } finally {
      setIsLoading(false)
    }
  }, [teacherId])

  useEffect(() => {
    if (teacherId) {
      void refetch()
    }
  }, [teacherId, refetch])

  const create = useCallback(
    async (dto: {
      studentId: number
      subjectId: number
      examType: string
      marksObtained: number
      maxMarks: number
      percentage?: number | null
      grade?: string | null
      examDate: string
      remarks?: string | null
    }) => {
      if (!teacherId) return
      await createPerformance(teacherId, dto)
      await refetch()
    },
    [teacherId, refetch]
  )

  const update = useCallback(
    async (
      performanceId: number,
      dto: {
        studentId: number
        subjectId: number
        examType: string
        marksObtained: number
        maxMarks: number
        percentage?: number | null
        grade?: string | null
        examDate: string
        remarks?: string | null
      }
    ) => {
      if (!teacherId) return
      await updatePerformance(teacherId, performanceId, dto)
      await refetch()
    },
    [teacherId, refetch]
  )

  const remove = useCallback(
    async (performanceId: number) => {
      await deletePerformance(performanceId)
      await refetch()
    },
    [refetch]
  )

  return {
    teacherId,
    items,
    students,
    subjects,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
  }
}


