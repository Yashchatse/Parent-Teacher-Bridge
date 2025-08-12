"use client"

export function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getArray<T>(key: string): T[] {
  return readFromStorage<T[]>(key, [])
}

export function setArray<T>(key: string, items: T[]): void {
  writeToStorage<T[]>(key, items)
}

export function generateId(keyForCounter: string, startAt = 1000): number {
  const current = readFromStorage<number>(`__counter__:${keyForCounter}`, startAt)
  const next = current + 1
  writeToStorage<number>(`__counter__:${keyForCounter}`, next)
  return next
}

export function upsertById<T extends Record<string, any>>(key: string, idField: keyof T, entity: T): T[] {
  const list = getArray<T>(key)
  const idx = list.findIndex((x) => String(x[idField]) === String(entity[idField]))
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entity }
  } else {
    list.push(entity)
  }
  setArray<T>(key, list)
  return list
}

export function removeById<T extends Record<string, any>>(key: string, idField: keyof T, idValue: any): T[] {
  const list = getArray<T>(key)
  const filtered = list.filter((x) => String(x[idField]) !== String(idValue))
  setArray<T>(key, filtered)
  return filtered
}

export const STORAGE_KEYS = {
  auth: "teacher.auth",
  profile: "teacher.profile",
  attendance: "teacher.attendance",
  performance: "teacher.performance",
  behaviour: "teacher.behaviour",
  timetable: "teacher.timetable",
  events: "teacher.events",
  messages: "teacher.messages",
}

export interface TeacherProfile {
  TeacherId: number
  Name?: string | null
  Email?: string | null
  Phone?: string | null
  Gender?: string | null
  Photo?: string | null
  Qualification?: string | null
  ExperienceYears?: number | null
}

export interface AttendanceRecord {
  AttendanceId: number
  StudentId: number
  ClassId: number
  Date: string // ISO date (yyyy-mm-dd)
  IsPresent: boolean
  Status?: string | null
  Remarks: string
  MarkedTime?: string | null // HH:mm
}

export interface PerformanceRecord {
  PerformanceId: number
  StudentId?: number | null
  TeacherId?: number | null
  SubjectId?: number | null
  ExamType?: string | null
  MarksObtained?: number | null
  MaxMarks?: number | null
  Percentage?: number | null
  Grade?: string | null
  ExamDate?: string | null // ISO date
  Remarks?: string | null
}

export interface BehaviourRecord {
  BehaviourId: number
  StudentId: number
  TeacherId: number
  IncidentDate: string // ISO datetime
  BehaviourCategory: string
  Severity: string
  Description: string
}

export interface TimetableItem {
  TimetableId: number
  ClassId?: number | null
  SubjectId?: number | null
  TeacherId?: number | null
  Weekday?: string | null
  StartTime?: string | null // HH:mm
  EndTime?: string | null // HH:mm
}

export interface EventRecord {
  EventId: number
  Title?: string | null
  Description?: string | null
  EventDate?: string | null // ISO date
  StartTime?: string | null // HH:mm
  EndTime?: string | null // HH:mm
  Venue?: string | null
  EventType?: string | null
  TeacherId?: number | null
  IsActive?: boolean | null
}

export interface MessageRecord {
  MessageId: number
  SenderId?: number | null
  SenderRole?: string | null
  ReceiverId?: number | null
  ReceiverRole?: string | null
  MessageContext?: string | null
  Message1?: string | null
  SentAt?: string | null // ISO datetime
}

# School Admin Dashboard

A modern React TypeScript application for school administration management.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── login.tsx      # Login page component
│   ├── sidebar.tsx    # Navigation sidebar
│   ├── dashboard-content.tsx  # Main dashboard content
│   └── ...           # Other management components
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   └── dashboard.tsx  # Dashboard page
├── services/          # API service layer
├── context/           # React context providers
└── App.tsx           # Main application component
```

## Features

- **Login System**: Email/password authentication
- **Dashboard**: Overview with statistics and quick actions
- **Student Management**: Add, edit, delete students
- **Teacher Management**: Manage teacher profiles
- **Class Management**: Handle class assignments
- **Subject Management**: Manage subjects and courses
- **Timetable Management**: Schedule management
- **Analytics**: Data visualization and reports
- **Settings**: Application configuration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Login

For demo purposes, any email and password combination will work. In a production environment, this should be connected to a proper authentication backend.

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Shadcn/ui Components

## Development

The application uses a modern React setup with:
- TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- Component-based architecture
- Custom hooks for state management
