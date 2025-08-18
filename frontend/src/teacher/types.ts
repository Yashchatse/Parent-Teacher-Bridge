export interface TeacherProfile {
  // Try both cases - your API might return different casing
  TeacherId?: number
  teacherId?: number
  Name?: string
  name?: string
  Email?: string
  email?: string
  Phone?: string
  phone?: string
  Gender?: string
  gender?: string
  Qualification?: string
  qualification?: string
  ExperienceYears?: number
  experienceYears?: number
  Photo?: string
  photo?: string
  // Add any other fields you see in the console
  [key: string]: any // Allow any additional fields
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
