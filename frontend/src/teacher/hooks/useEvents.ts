"use client"

import { useState, useEffect, useCallback } from "react"
import { getCurrentTeacher } from "../auth"
import { fetchEvents, createEvent, updateEvent, deleteEvent, CreateEventDto, UpdateEventDto } from "../services/eventService"
import type { EventRecord } from "../types"

export interface UseEventsResult {
  events: EventRecord[]
  isLoading: boolean
  error: string | null
  create: (data: CreateEventDto) => Promise<void>
  update: (eventId: number, data: UpdateEventDto) => Promise<void>
  remove: (eventId: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchEvents()
      setEvents(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load events")
      console.error("Error loading events:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const create = useCallback(async (data: CreateEventDto) => {
    try {
      setError(null)
      await createEvent(data)
      await load() // Refresh list
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to create event"
      setError(message)
      throw new Error(message)
    }
  }, [load])

  const update = useCallback(async (eventId: number, data: UpdateEventDto) => {
    try {
      setError(null)
      await updateEvent(eventId, data)
      await load() // Refresh list
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to update event"
      setError(message)
      throw new Error(message)
    }
  }, [load])

  const remove = useCallback(async (eventId: number) => {
    try {
      setError(null)
      await deleteEvent(eventId)
      await load() // Refresh list
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete event"
      setError(message)
      throw new Error(message)
    }
  }, [load])

  const refetch = useCallback(async () => {
    await load()
  }, [load])

  useEffect(() => {
    load()
  }, [load])

  return {
    events,
    isLoading,
    error,
    create,
    update,
    remove,
    refetch
  }
}

export default useEvents
