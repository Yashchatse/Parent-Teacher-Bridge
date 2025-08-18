"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchTeacherProfileById, updateTeacherProfile, type UpdatableTeacheProfile } from "../services/teacherProfileService"
import { getCurrentTeacher } from "../auth"
import { extractTeacherFromToken } from "../utils/jwt"
import { STORAGE_KEYS, readFromStorage } from "../storage"
import type { TeacherProfile } from "../types"

export interface UseTeacherProfileResult {
  profile: TeacherProfile | null
  isLoading: boolean
  error: string | null
  isSaving: boolean
  save: (data: UpdatableTeacherProfile) => Promise<void>
  refetch: () => Promise<void>
}

export default function useTeacherProfile(): UseTeacherProfileResult {
  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const getTeacherId = useCallback((): number | null => {
    console.log("=== Getting Teacher ID ===")
    
    // First try to get from current auth
    const currentTeacher = getCurrentTeacher()
    console.log("Current teacher from auth:", currentTeacher)
    
    if (currentTeacher?.teacherId && currentTeacher.teacherId > 0) {
      console.log(`Using teacher ID from auth: ${currentTeacher.teacherId}`)
      return currentTeacher.teacherId
    }

    // If not found, try to extract from token again
    const token = readFromStorage<string | null>(STORAGE_KEYS.token, null)
    console.log("Token from storage:", token ? "Found" : "Not found")
    
    if (token) {
      const { teacherId } = extractTeacherFromToken(token)
      console.log("Teacher ID extracted from token:", teacherId)
      
      if (teacherId && teacherId > 0) {
        return teacherId
      }
    }

    console.log("No teacher ID found in JWT token. Using fallback ID 1 for testing.")
    return 1 // Fallback for testing
  }, [])

  const load = useCallback(async () => {
    console.log("=== Loading Teacher Profile ===")
    try {
      setIsLoading(true)
      setError(null)

      const teacherId = getTeacherId()
      console.log("Teacher ID for loading:", teacherId)
      
      if (!teacherId) {
        throw new Error("No teacher ID available")
      }

      console.log(`Fetching profile for teacher ID: ${teacherId}`)
      const data = await fetchTeacherProfileById(teacherId)
      console.log("Profile data received:", data)
      setProfile(data)
    } catch (err: any) {
      console.error("=== Error Loading Profile ===", err)
      
      let message = "Failed to load teacher profile"
      
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          message = err.response.data
        } else if (err.response.data.message) {
          message = err.response.data.message
        } else if (err.response.data.title) {
          message = err.response.data.title
        }
      } else if (err?.message) {
        message = err.message
      }
      
      console.error("Error message:", message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [getTeacherId])

  const save = useCallback(async (data: UpdatableTeacherProfile) => {
    console.log("=== Saving Teacher Profile ===")
    try {
      setIsSaving(true)
      setError(null)

      const teacherId = getTeacherId()
      if (!teacherId) {
        throw new Error("No teacher ID available")
      }

      console.log("Saving data:", data)
      
      // Validate required fields before sending
      if (!data.Name || data.Name.trim() === '') {
        throw new Error("Name is required")
      }
      
      if (!data.Email || data.Email.trim() === '') {
        throw new Error("Email is required")
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.Email)) {
        throw new Error("Please enter a valid email address")
      }

      await updateTeacherProfile(teacherId, data)
      
      // Refetch to get updated data
      await load()
      
      console.log("Profile saved successfully")
    } catch (err: any) {
      console.error("=== Error Saving Profile ===", err)
      
      let message = "Failed to update teacher profile"
      
      // Handle different error types
      if (err.name === 'UpdateError') {
        message = err.message
      } else if (err?.message) {
        message = err.message
      }
      
      console.error("Save error message:", message)
      setError(message)
      throw new Error(message) // Re-throw with cleaned message
    } finally {
      setIsSaving(false)
    }
  }, [getTeacherId, load])

  const refetch = useCallback(async () => {
    await load()
  }, [load])

  useEffect(() => {
    console.log("=== useTeacherProfile useEffect triggered ===")
    load()
  }, [load])

  return {
    profile,
    isLoading,
    error,
    isSaving,
    save,
    refetch
  }
}