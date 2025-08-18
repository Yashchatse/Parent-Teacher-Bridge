"use client"
import apiClient from "./apiClient"
import type { EventRecord } from "../types"
import { getCurrentTeacher } from "../auth"

export interface CreateEventDto {
  Title?: string | null
  Description?: string | null
  EventDate?: string | null
  StartTime?: string | null
  EndTime?: string | null
  Venue?: string | null
  EventType?: string | null
  EventId?: number | null
}

export interface UpdateEventDto extends CreateEventDto {
  EventId: number
}

export async function fetchEvents(): Promise<EventRecord[]> {
  const res = await apiClient.get<any[]>("/teacher/Teachers/events")
  return (res.data || []).map(normalizeEvent)
}

export async function createEvent(data: CreateEventDto): Promise<EventRecord> {
  // Auto-assign eventId as last id + 1
  const base = sanitizeEventPayload(data)
  let nextId = 1
  try {
    const existing = await fetchEvents()
    const maxId = existing.reduce((m, e) => (e.EventId && e.EventId > m ? e.EventId : m), 0)
    nextId = maxId + 1
  } catch {}

  const payload: SanitizedEventPayload = { ...base, eventId: nextId }
  const res = await apiClient.post<any>("/teacher/Teachers/events", payload)
  return normalizeEvent(res.data)
}

export async function updateEvent(eventId: number, data: UpdateEventDto): Promise<void> {
  const base = sanitizeEventPayload(data)
  const payload: SanitizedEventPayload = { ...base, eventId }
  await apiClient.put(`/teacher/Teachers/events/${eventId}`, payload)
}

export async function deleteEvent(eventId: number): Promise<void> {
  await apiClient.delete(`/teacher/Teachers/events/${eventId}`)
}

function normalizeEvent(e: any): EventRecord {
  return {
    EventId: e?.EventId ?? e?.eventId ?? e?.id ?? 0,
    Title: e?.Title ?? e?.title ?? e?.EventName ?? e?.name ?? null,
    Description: e?.Description ?? e?.description ?? null,
    EventDate: e?.EventDate ?? e?.eventDate ?? e?.Date ?? e?.date ?? null,
    StartTime: e?.StartTime ?? e?.startTime ?? null,
    EndTime: e?.EndTime ?? e?.endTime ?? null,
    Venue: e?.Venue ?? e?.venue ?? null,
    EventType: e?.EventType ?? e?.eventType ?? e?.Type ?? e?.type ?? null,
    TeacherId: e?.TeacherId ?? e?.teacherId ?? null,
    IsActive: e?.IsActive ?? e?.isActive ?? null,
  }
}

type SanitizedEventPayload = {
  eventId?: number
  title: string | null
  description: string | null
  eventDate: string | null
  startTime: string | null
  endTime: string | null
  venue: string | null
  eventType: string | null
  teacherId: number | null
  isActive: boolean
}

function sanitizeEventPayload(e: any): SanitizedEventPayload {
  const toNull = (v: any) => (v === "" || v === undefined ? null : v)
  const current = getCurrentTeacher()
  const teacherId: number | null = current?.teacherId ?? null
  
  const payload: SanitizedEventPayload = {
    title: toNull(e.Title ?? e.title),
    description: toNull(e.Description ?? e.description),
    eventDate: toNull(e.EventDate ?? e.eventDate ?? e.Date ?? e.date),
    startTime: toHHMMSS(toNull(e.StartTime ?? e.startTime)),
    endTime: toHHMMSS(toNull(e.EndTime ?? e.endTime)),
    venue: toNull(e.Venue ?? e.venue),
    eventType: toNull(e.EventType ?? e.eventType ?? e.Type ?? e.type),
    teacherId: teacherId,
    isActive: e.IsActive ?? e.isActive ?? true,
  }
  
  // Only include EventId if it exists and is valid
  if (e.EventId && e.EventId > 0) {
    payload.eventId = Number(e.EventId)
  }
  
  return payload
}

function toHHMMSS(value: string | null): string | null {
  if (!value) return null
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`
  try {
    const d = new Date(`1970-01-01T${value}`)
    const hh = String(d.getHours()).padStart(2, "0")
    const mm = String(d.getMinutes()).padStart(2, "0")
    const ss = String(d.getSeconds()).padStart(2, "0")
    return `${hh}:${mm}:${ss}`
  } catch {
    return value
  }
}