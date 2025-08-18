"use client"

import { STORAGE_KEYS, readFromStorage, writeToStorage } from "./storage"
import { extractTeacherFromToken } from "./utils/jwt"
// import type { TeacherProfile } from "./types"

// Updated password rule: at least 8 chars, include uppercase, lowercase, digit, and special char
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export function validatePasswordRules(password: string): string | null {
  if (!PASSWORD_RULE.test(password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character."
  }
  return null
}

export function isAuthenticated(): boolean {
  const auth = readFromStorage<{ email: string; teacherId: number } | null>(STORAGE_KEYS.auth, null)
  const token = readFromStorage<string | null>(STORAGE_KEYS.token, null)
  return !!auth && !!token
}

export function getCurrentTeacher(): { email: string; teacherId: number } | null {
  return readFromStorage(STORAGE_KEYS.auth, null)
}

export function logout(): void {
  writeToStorage(STORAGE_KEYS.auth, null)
  writeToStorage(STORAGE_KEYS.token, null)
}

// Placeholder: actual login via teacherService in services/teacher
export async function setAuthenticatedUser(user: { email: string; teacherId: number }, token: string) {
  const { teacherId: idFromToken, email: emailFromToken } = extractTeacherFromToken(token)
  
  const finalUser = {
    email: user.email || emailFromToken || "",
    teacherId: user.teacherId && user.teacherId > 0 ? user.teacherId : (idFromToken ?? 0),
  }
  
  console.log("Setting authenticated user:", finalUser)
  writeToStorage(STORAGE_KEYS.auth, finalUser)
  writeToStorage(STORAGE_KEYS.token, token)
}
