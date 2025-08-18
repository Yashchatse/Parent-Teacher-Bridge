"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { validatePasswordRules } from "../auth"
import { useTeacherLogin } from "../hooks/useTeacherLogin"

interface TeacherLoginProps {
  onLoggedIn?: (user: { email: string; teacherId: number }) => void;
  onLogin?: (userData: any) => void;
  onBack?: () => void;
}

export default function TeacherLogin({ onLoggedIn, onLogin, onBack }: TeacherLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { isLoading, error, login } = useTeacherLogin()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast("Error", "Please fill in all fields", { variant: "destructive" })
      return
    }
    const ruleError = validatePasswordRules(password)
    if (ruleError) {
      toast("Error", ruleError, { variant: "destructive" })
      return
    }
    const res = await login(email, password)
    if (res.success) {
      toast("Success", "Login successful!", {})
      const userData = { email, teacherId: 0, role: 'teacher' };
      // Use the new onLogin prop if available, otherwise fall back to onLoggedIn
      if (onLogin) {
        onLogin(userData);
      } else if (onLoggedIn) {
        onLoggedIn({ email, teacherId: 0 });
      }
    } else {
      toast("Error", res.error || error || "Login failed", { variant: "destructive" })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 py-12 px-4 sm:px-6 lg:px-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 inline-flex items-center text-sm text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100 shadow-sm transition-colors"
        >
          ← Back to Role Selection
        </button>
      )}
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl">
        <CardHeader className="space-y-3">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5v6a2 2 0 01-1.106 1.789L12 21l-7.894-4.211A2 2 0 013 15V9l9 5z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">Teacher Login</CardTitle>
          <CardDescription className="text-center">Enter your email and password to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="teacher@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-indigo-100 rounded-xl bg-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-indigo-900">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-indigo-100 rounded-xl bg-white placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
              />
              <p className="text-xs text-gray-500">Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.</p>
            </div>
            <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
