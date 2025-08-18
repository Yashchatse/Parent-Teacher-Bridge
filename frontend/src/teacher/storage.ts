"use client"

export function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getArray<T>(key: string): T[] {
  return readFromStorage<T[]>(key, [])
}

export function setArray<T>(key: string, items: T[]): void {
  writeToStorage<T[]>(key, items)
}

export function generateId(keyForCounter: string, startAt = 1000): number {
  const current = readFromStorage<number>(`__counter__:${keyForCounter}`, startAt)
  const next = current + 1
  writeToStorage<number>(`__counter__:${keyForCounter}`, next)
  return next
}

export function upsertById<T extends Record<string, any>>(key: string, idField: keyof T, entity: T): T[] {
  const list = getArray<T>(key)
  const idx = list.findIndex((x) => String(x[idField]) === String(entity[idField]))
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entity }
  } else {
    list.push(entity)
  }
  setArray<T>(key, list)
  return list
}

export function removeById<T extends Record<string, any>>(key: string, idField: keyof T, idValue: any): T[] {
  const list = getArray<T>(key)
  const filtered = list.filter((x) => String(x[idField]) !== String(idValue))
  setArray<T>(key, filtered)
  return filtered
}

export const STORAGE_KEYS = {
  auth: "teacher.auth",
  token: "teacher.token",
  profile: "teacher.profile",
  attendance: "teacher.attendance",
  performance: "teacher.performance",
  behaviour: "teacher.behaviour",
  timetable: "teacher.timetable",
  events: "teacher.events",
  messages: "teacher.messages",
}
