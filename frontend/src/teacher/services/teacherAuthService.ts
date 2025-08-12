"use client"

import apiClient from "./apiClient"

export interface TeacherLoginPayload {
  email: string
  password: string
}

export interface TeacherLoginResponse {
  token: string
}

export async function teacherLogin(payload: TeacherLoginPayload): Promise<TeacherLoginResponse> {
  const { email, password } = payload
  // Backend route: [ApiController][Route("login/[controller]")] LoginController + [HttpPost("teacher/login")]
  // If the controller class name is LoginController, controller token resolves to "login" by default.
  // Final path typically: "/login/login/teacher/login" (as used for admin). If your backend uses "/login/teacher/login" use that instead.
  const res = await apiClient.post<TeacherLoginResponse>("login/Login/teacher/login", { email, password })
  return res.data
}


