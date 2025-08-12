"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  APITimetable,
  SchoolClass,
  Subject,
  fetchClasses,
  fetchSubjects,
  fetchTeacherTimetable,
  normalizeTime,
} from "../services/timetable"

export function useTeacherTimetable() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<APITimetable[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classFilter, setClassFilter] = useState<number | "">("")

  const subjectById = useMemo(() => {
    const map = new Map<number, string>()
    subjects.forEach((s) => map.set(s.subjectId, s.name))
    return map
  }, [subjects])

  const classById = useMemo(() => {
    const map = new Map<number, string>()
    classes.forEach((c) => map.set(c.classId, c.className))
    return map
  }, [classes])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [tt, s, c] = await Promise.all([
        fetchTeacherTimetable(),
        fetchSubjects(),
        fetchClasses(),
      ])
      setItems(tt)
      setSubjects(s)
      setClasses(c)
    } catch (e: any) {
      const raw = e?.response?.data
      const message = typeof raw === "string" ? raw : (raw?.title || raw?.detail || e?.message || "Failed to load timetable")
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    return items.filter((x) => {
      const clsId = x.classId ?? 0
      return classFilter === "" ? true : Number(clsId) === Number(classFilter)
    })
  }, [items, classFilter])

  const getSubjectName = (subjectId?: number | null) => {
    if (!subjectId) return ""
    return subjectById.get(Number(subjectId)) || String(subjectId)
  }

  const getClassName = (classId?: number | null) => {
    if (!classId) return ""
    return classById.get(Number(classId)) || String(classId)
  }

  const getScheduleForSlot = (
    day: string,
    slot: { startTime: string; endTime: string }
  ) => {
    return filtered.find(
      (item) =>
        (item.weekday ?? "").toLowerCase() === day.toLowerCase() &&
        normalizeTime(item.startTime) === slot.startTime &&
        normalizeTime(item.endTime) === slot.endTime
    )
  }

  return {
    loading,
    error,
    items,
    classes,
    subjects,
    classFilter,
    setClassFilter,
    getSubjectName,
    getClassName,
    getScheduleForSlot,
    refresh: load,
  }
}


