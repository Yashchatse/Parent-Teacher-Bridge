"use client"

import apiClient from "./apiClient"
import type { TeacherProfile } from "../types"

export async function fetchTeacherProfileById(teacherId: number): Promise<TeacherProfile> {
  try {
    console.log(`Making API call to: /teacher/Teachers/${teacherId}`)
    const res = await apiClient.get<any>(`/teacher/Teachers/${teacherId}`)
    
    console.log("Raw API Response:", res.data)
    console.log("Response keys:", Object.keys(res.data))
    console.log("Response structure:", JSON.stringify(res.data, null, 2))
    
    // Transform the data if needed to match your interface
    const transformedData: TeacherProfile = {
      TeacherId: res.data.TeacherId || res.data.teacherId || res.data.id,
      Name: res.data.Name || res.data.name,
      Email: res.data.Email || res.data.email,
      Phone: res.data.Phone || res.data.phone,
      Gender: res.data.Gender || res.data.gender,
      Qualification: res.data.Qualification || res.data.qualification,
      ExperienceYears: res.data.ExperienceYears || res.data.experienceYears,
      // Include the raw data as well
      ...res.data
    }
    
    console.log("Transformed data:", transformedData)
    return transformedData
    
  } catch (error: any) {
    console.error("API Error:", error)
    console.error("Error details:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      url: error?.config?.url
    })
    throw error
  }
}

export type UpdatableTeacherProfile = Pick<
  TeacherProfile,
  | "TeacherId"
  | "Name"
  | "Email"
  | "Phone"
  | "Gender"
  | "Qualification"
  | "ExperienceYears"
>

export async function updateTeacherProfile(
  teacherId: number,
  data: UpdatableTeacherProfile
): Promise<void> {
  try {
    console.log(`Updating teacher profile for ID: ${teacherId}`, data)
    
    // Clean the data before sending - remove any undefined/null values
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {} as any)
    
    // Remove TeacherId from the payload as it's in the URL
    const { TeacherId, ...updatePayload } = cleanData
    
    console.log("Cleaned update payload:", updatePayload)
    console.log("Payload data types:", Object.entries(updatePayload).map(([key, value]) => `${key}: ${typeof value} (${value})`))
    
    const response = await apiClient.put(`/teacher/Teachers/${teacherId}`, updatePayload)
    console.log("Update response:", response.data)
    console.log("Profile updated successfully")
  } catch (error: any) {
    console.error("Update API Error:", error)
    
    // Enhanced error logging
    if (error.response) {
      console.error("Error response status:", error.response.status)
      console.error("Error response data:", error.response.data)
      console.error("Error response headers:", error.response.headers)
      
      // Create a more user-friendly error message
      let errorMessage = "Failed to update profile"
      
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title
        } else if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ')
          errorMessage = `Validation errors: ${validationErrors}`
        }
      }
      
      // Create a new error with the friendly message
      const friendlyError = new Error(errorMessage)
      friendlyError.name = 'UpdateError'
      throw friendlyError
    } else if (error.request) {
      console.error("No response received:", error.request)
      throw new Error("No response from server. Please check your connection.")
    } else {
      console.error("Request setup error:", error.message)
      throw new Error(`Request error: ${error.message}`)
    }
  }
}