"use client"

import apiClient from "./apiClient"
import type { BehaviourRecord } from "../types"

export interface CreateBehaviourDto {
  IncidentDate: string // yyyy-mm-dd
  BehaviourCategory: string
  Severity: string
  Description: string
}

export interface UpdateBehaviourDto extends CreateBehaviourDto {}

export interface StudentItem {
  StudentId: number
  Name: string
  ClassId?: number | null
}

export interface ClassItem {
  ClassId: number
  TeacherId?: number | null
  ClassName?: string | null
}

export async function fetchAllBehavioursByTeacher(teacherId: number): Promise<BehaviourRecord[]> {
  const res = await apiClient.get<BehaviourRecord[]>(`/teacher/Teachers/${teacherId}/behaviours`)

  // Map the response to handle different property naming conventions
  return (res.data || []).map((item: any) => ({
    BehaviourId: item?.BehaviourId ?? item?.behaviourId ?? item?.id,
    StudentId: item?.StudentId ?? item?.studentId,
    IncidentDate: item?.IncidentDate ?? item?.incidentDate ?? item?.date,
    BehaviourCategory: item?.BehaviourCategory ?? item?.behaviourCategory ?? item?.category,
    Severity: item?.Severity ?? item?.severity,
    Description: item?.Description ?? item?.description,
    // Preserve any other fields that might exist
    ...item
  }))
}

export async function createBehaviour(teacherId: number, studentId: number, dto: CreateBehaviourDto): Promise<void> {
  // Get all behaviours to find the next available ID
  const existingBehaviours = await fetchAllBehavioursByTeacher(teacherId)
  const maxId = existingBehaviours.length > 0 ? Math.max(...existingBehaviours.map(b => b.BehaviourId || 0)) : 0
  const nextId = maxId + 1
  
  // Add the auto-generated ID to the payload
  const payload = {
    ...dto,
    BehaviourId: nextId
  }
  
  await apiClient.post(`/teacher/Teachers/${teacherId}/students/${studentId}/behaviours`, payload)
}

export async function updateBehaviour(
  teacherId: number,
  studentId: number,
  behaviourId: number,
  dto: UpdateBehaviourDto
): Promise<void> {
  await apiClient.put(`/teacher/Teachers/${teacherId}/students/${studentId}/behaviours/${behaviourId}`, dto)
}

export async function deleteBehaviour(teacherId: number, studentId: number, behaviourId: number): Promise<void> {
  // Some APIs require DELETE with an empty body; axios supports sending data via config
  await apiClient.delete(`/teacher/Teachers/${teacherId}/students/${studentId}/behaviours/${behaviourId}`)
}

// Updated function to use the new teacher-specific students endpoint
export async function fetchStudentsByTeacher(teacherId: number): Promise<StudentItem[]> {
  const res = await apiClient.get<any[]>(`/teacher/Teachers/${teacherId}/students`)
  return (res.data || []).map((s: any) => ({
    StudentId: s?.StudentId ?? s?.studentId ?? s?.id,
    Name:
      s?.Name ??
      s?.name ??
      `${s?.FirstName ?? ""} ${s?.LastName ?? ""}`.trim(),
    ClassId: s?.ClassId ?? s?.classId ?? null,
  }))
}

// Keep the original function for backward compatibility if needed elsewhere
export async function fetchAllStudents(): Promise<StudentItem[]> {
  const res = await apiClient.get<any[]>(`/teacher/Teachers/students`)
  return (res.data || []).map((s: any) => ({
    StudentId: s?.StudentId ?? s?.studentId ?? s?.id,
    Name:
      s?.Name ??
      s?.name ??
      `${s?.FirstName ?? ""} ${s?.LastName ?? ""}`.trim(),
    ClassId: s?.ClassId ?? s?.classId ?? null,
  }))
}

export async function fetchAllClasses(): Promise<ClassItem[]> {
  const res = await apiClient.get<any[]>(`/admin/Admins/classes`)
  return (res.data || []).map((c: any) => ({
    ClassId: c?.ClassId ?? c?.classId ?? c?.Id,
    TeacherId: c?.TeacherId ?? c?.teacherId ?? null,
    ClassName: c?.ClassName ?? c?.name ?? null,
  }))
}