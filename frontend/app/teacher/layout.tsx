"use client"

import React from "react"
import TeacherLayoutShell from "@/teacher/components/TeacherLayoutShell"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TeacherLayoutShell>{children}</TeacherLayoutShell>
}
