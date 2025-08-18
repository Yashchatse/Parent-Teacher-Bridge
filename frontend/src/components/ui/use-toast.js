"use client"

import { useState } from "react"

const toastQueue = []
let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default" }) => {
    const id = toastId++
    const newToast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  return { toast, toasts }
}
