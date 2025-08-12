"use client"

import { useCallback, useState } from "react"
import { validatePasswordRules, setAuthenticatedUser } from "../auth"
import { teacherLogin } from "../services/teacherAuthService"

export interface UseTeacherLoginResult {
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

export function useTeacherLogin(): UseTeacherLoginResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      if (!email || !password) {
        setError("Email and password required")
        return { success: false, error: "Email and password required" }
      }

      const ruleError = validatePasswordRules(password)
      if (ruleError) {
        setError(ruleError)
        return { success: false, error: ruleError }
      }

      const { token } = await teacherLogin({ email, password })

      // Persist token; user id/email will be extracted from token and saved
      await setAuthenticatedUser({ email, teacherId: 0 }, token)

      return { success: true }
    } catch (err: any) {
      const message = err?.response?.data ?? err?.message ?? "Login failed"
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, error, login }
}

export default useTeacherLogin


