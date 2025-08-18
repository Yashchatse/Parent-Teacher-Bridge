"use client"

import axios from "axios"
import { readFromStorage, STORAGE_KEYS } from "../../teacher/storage"
import { extractTeacherFromToken } from "../../teacher/utils/jwt"

export type APITimetable = {
  timetableId?: number
  classId?: number | null
  subjectId?: number | null
  teacherId?: number | null
  weekday?: string | null
  startTime?: string | null
  endTime?: string | null
}

export type SchoolClass = { classId: number; className: string }
export type Subject = { subjectId: number; name: string }

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? (window as any).__NEXT_PUBLIC_API_BASE_URL : null) || 'http://localhost:5000') as string

function getAuthToken(): string | null {
  // Prefer teacher token storage; fallback to global auth token
  const teacherToken = readFromStorage<string | null>(STORAGE_KEYS.token, null)
  if (teacherToken) return teacherToken
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export function getTeacherIdFromToken(): number | null {
  const token = getAuthToken()
  let teacherId: number | null = null
  if (token) {
    const fromJwt = extractTeacherFromToken(token)
    if (fromJwt.teacherId && !isNaN(Number(fromJwt.teacherId))) {
      teacherId = Number(fromJwt.teacherId)
    }
  }
  if (!teacherId) {
    const auth = readFromStorage<{ email: string; teacherId: number } | null>(STORAGE_KEYS.auth, null)
    if (auth?.teacherId && !isNaN(Number(auth.teacherId))) {
      teacherId = Number(auth.teacherId)
    }
  }
  return teacherId
}

function createClient() {
  const token = getAuthToken()
  return axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

export async function fetchTeacherTimetable(): Promise<APITimetable[]> {
  const client = createClient()
  try {
    // Preferred: backend reads teacher id from JWT
    const res = await client.get<APITimetable[]>(`/teacher/Teachers/timetable/teacherid`)
    return (res.data || []).map((x) => ({
      ...x,
      startTime: x.startTime ?? null,
      endTime: x.endTime ?? null,
    }))
  } catch (err: any) {
    // Fallback: pass explicit teacherId if backend doesn't support 'teacherid'
    const teacherId = getTeacherIdFromToken()
    if (!teacherId) throw err
    const res = await client.get<APITimetable[]>(`/teacher/Teachers/timetable/${teacherId}`)
    return (res.data || []).map((x) => ({
      ...x,
      startTime: x.startTime ?? null,
      endTime: x.endTime ?? null,
    }))
  }
}

export async function fetchSubjects(): Promise<Subject[]> {
  const client = createClient()
  const res = await client.get<any[]>(`/admin/Admins/subjects`)
  const list = res.data || []
  return list.map((s) => ({
    subjectId: s.subjectId ?? s.SubjectId ?? s.id ?? s.Id,
    name: s.name ?? s.subjectName ?? s.SubjectName ?? String(s.subjectId ?? s.SubjectId ?? "")
  }))
}

export async function fetchClasses(): Promise<SchoolClass[]> {
  const client = createClient()
  const res = await client.get<any[]>(`/admin/Admins/classes`)
  const list = res.data || []
  return list.map((c) => ({
    classId: c.classId ?? c.ClassId ?? c.id ?? c.Id,
    className: c.className ?? c.name ?? c.ClassName ?? String(c.classId ?? c.ClassId ?? "")
  }))
}

export function normalizeTime(value?: string | null): string {
  if (!value) return ""
  // Expect backend times like HH:mm:ss; return HH:mm for UI grid
  return value.slice(0, 5)
}


