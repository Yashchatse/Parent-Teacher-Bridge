"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getCurrentTeacher } from "../auth"
import {
  fetchAllClasses,
  fetchStudentsByTeacher,
  fetchAllBehavioursByTeacher,
  createBehaviour,
  updateBehaviour,
  deleteBehaviour,
  type CreateBehaviourDto,
  type UpdateBehaviourDto,
  type StudentItem,
  type ClassItem,
} from "../services/behaviourService"
import type { BehaviourRecord } from "../types"

export default function useBehaviour() {
  const teacherId = getCurrentTeacher()?.teacherId || 0
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [students, setStudents] = useState<StudentItem[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentItem[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [behaviours, setBehaviours] = useState<BehaviourRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMeta = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Loading meta data for teacherId:", teacherId) // Debug log
      
      // Use the new teacher-specific endpoint to get only relevant students
      const [cls, teacherStudents] = await Promise.all([
        fetchAllClasses(), 
        fetchStudentsByTeacher(teacherId)
      ])
      
      console.log("All classes:", cls) // Debug log
      console.log("Teacher's students:", teacherStudents) // Debug log
      
      setClasses(cls)
      setStudents(teacherStudents) // These are already the teacher's students
      setFilteredStudents(teacherStudents) // No additional filtering needed
      
      // Set first student from the teacher's students as default selection
      if (teacherStudents.length > 0) {
        setSelectedStudentId(teacherStudents[0].StudentId)
        console.log("Selected default student:", teacherStudents[0].StudentId, teacherStudents[0].Name) // Debug log
      } else {
        console.log("No students found for this teacher") // Debug log
      }
    } catch (err: any) {
      console.error("Error loading meta data:", err) // Debug log
      setError(err?.message || "Failed to load classes/students")
    } finally {
      setIsLoading(false)
    }
  }, [teacherId])

  const loadBehaviours = useCallback(async () => {
    if (!teacherId) return
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchAllBehavioursByTeacher(teacherId)
      setBehaviours(data)
    } catch (err: any) {
      setError(err?.message || "Failed to load behaviours")
    } finally {
      setIsLoading(false)
    }
  }, [teacherId])

  useEffect(() => {
    loadMeta()
  }, [loadMeta])

  useEffect(() => {
    loadBehaviours()
  }, [loadBehaviours])

  const add = useCallback(async (dto: CreateBehaviourDto) => {
    if (!teacherId) return
    const targetStudentId = selectedStudentId || filteredStudents[0]?.StudentId
    if (!targetStudentId) return
    await createBehaviour(teacherId, targetStudentId, dto)
    await loadBehaviours()
  }, [teacherId, selectedStudentId, filteredStudents, loadBehaviours])

  const update = useCallback(async (behaviourId: number, dto: UpdateBehaviourDto) => {
    if (!teacherId) return
    // Derive studentId from current selection or the behaviour itself
    const targetStudentId = selectedStudentId || behaviours.find(b => b.BehaviourId === behaviourId)?.StudentId || filteredStudents[0]?.StudentId
    if (!targetStudentId) return
    await updateBehaviour(teacherId, targetStudentId, behaviourId, dto)
    await loadBehaviours()
  }, [teacherId, selectedStudentId, behaviours, filteredStudents, loadBehaviours])

  const remove = useCallback(async (behaviourId: number) => {
    if (!teacherId) return
    // When no selected student filter, derive studentId from the record
    const targetStudentId = selectedStudentId || behaviours.find(b => b.BehaviourId === behaviourId)?.StudentId
    if (!targetStudentId) return
    await deleteBehaviour(teacherId, targetStudentId, behaviourId)
    await loadBehaviours()
  }, [teacherId, selectedStudentId, behaviours, loadBehaviours])

  return {
    teacherId,
    classes,
    students,
    filteredStudents,
    selectedStudentId,
    setSelectedStudentId,
    behaviours,
    isLoading,
    error,
    add,
    update,
    remove,
    refetch: loadBehaviours,
  }
}