
// 1. Fixed JWT utility (jwt.ts)
export interface DecodedJwtPayload {
  [key: string]: any
}

export function decodeJwt(token: string): DecodedJwtPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const payload = parts[1]
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padLength = (4 - (normalized.length % 4)) % 4
    const padded = normalized + "=".repeat(padLength)
    const json = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("utf8")
    const decoded = JSON.parse(json)
    return decoded
  } catch {
    return null
  }
}

export function extractTeacherFromToken(token: string): { teacherId?: number; email?: string } {
  const payload = decodeJwt(token)
  if (!payload) return {}
  
  console.log("JWT Payload:", payload)
  
  // Microsoft-style claim URIs first, then standard claims
  const possibleIdKeys = [
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    "teacherId", "TeacherId", "nameid", "sub", "id", "jti", "unique_name"
  ]
  
  let teacherId: number | undefined
  for (const key of possibleIdKeys) {
    const value = payload[key]
    if (value !== undefined && !isNaN(Number(value))) {
      teacherId = Number(value)
      console.log(`Found teacher ID ${teacherId} in claim "${key}"`)
      break
    }
  }
  
  const possibleEmailKeys = [
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
    "email", "Email", "upn", "unique_name"
  ]
  
  let email: string | undefined
  for (const key of possibleEmailKeys) {
    const value = payload[key]
    if (typeof value === "string" && value.includes("@")) {
      email = value
      console.log(`Found email ${email} in claim "${key}"`)
      break
    }
  }
  
  console.log("Extracted from token:", { teacherId, email })
  return { teacherId, email }
}