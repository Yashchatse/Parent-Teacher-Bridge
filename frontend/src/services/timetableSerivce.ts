// services/timetableService.ts
import axios from 'axios';

const BASE_ROOT = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');
const BASE_URL = `${BASE_ROOT.replace(/\/$/, '')}/admin/Admins`;

// Configure axios with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on your backend model
export interface Timetable {
  timetableId: number;
  classId: number | null;
  subjectId: number | null;
  teacherId: number | null;
  weekday: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt?: string;
  updatedAt?: string;
  class?: SchoolClass | null;
  subject?: Subject | null;
  teacher?: Teacher | null;
}

export interface SchoolClass {
  classId: number;
  className: string;
}

export interface Subject {
  subjectId: number;
  name: string;  // Changed from subjectName to name
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  teacherId: number;
  name: string;  // Changed from firstName/lastName to name
  email?: string;
  password?: string;
  phone?: string;
  gender?: string;
  photo?: string;
  qualification?: string;
  experienceYears?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTimetableDto {
  timetableId?: number; // Make it optional for auto-generation
  classId: number;
  subjectId: number;
  teacherId: number;
  weekday: string;
  startTime: string;
  endTime: string;
}

export interface UpdateTimetableDto extends CreateTimetableDto {
  timetableId: number;
}

class TimetableService {
  // Utility method to format time from backend (remove seconds)
  private formatTimeFromBackend(time: string): string {
    if (!time) return '';
    // Convert "08:00:00" to "08:00"
    return time.slice(0, 5);
  }

  // Utility method to format time for backend (add seconds if needed)
  private formatTimeForBackend(time: string): string {
    if (!time) return '';
    // If time doesn't have seconds, add ":00"
    return time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
  }

  // Get next available timetable ID
  private async getNextTimetableId(): Promise<number> {
    try {
      const timetables = await this.getAllTimetables();
      const maxId = timetables.reduce((max, t) => Math.max(max, t.timetableId), 0);
      return maxId + 1;
    } catch (error) {
      console.warn('Failed to get existing timetables, starting with ID 1');
      return 1;
    }
  }

  // Get all classes
  async getAllClasses(): Promise<SchoolClass[]> {
    try {
      const response = await api.get<SchoolClass[]>('/classes');
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes');
    }
  }

  // Get class by ID
  async getClassById(id: number): Promise<SchoolClass> {
    try {
      const response = await api.get<SchoolClass>(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error);
      throw new Error(`Failed to fetch class with ID ${id}`);
    }
  }

  // Get all subjects
  async getAllSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get<Subject[]>('/subjects');
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new Error('Failed to fetch subjects');
    }
  }

  // Get subject by ID
  async getSubjectById(id: number): Promise<Subject> {
    try {
      const response = await api.get<Subject>(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subject ${id}:`, error);
      throw new Error(`Failed to fetch subject with ID ${id}`);
    }
  }

  // Get all teachers
  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const response = await api.get<Teacher[]>('/teachers');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch teachers');
    }
  }

  // Get teacher by ID
  async getTeacherById(id: number): Promise<Teacher> {
    try {
      const response = await api.get<Teacher>(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error);
      throw new Error(`Failed to fetch teacher with ID ${id}`);
    }
  }

  // Get all timetables with populated relations
  async getAllTimetables(): Promise<Timetable[]> {
    try {
      const response = await api.get<Timetable[]>('/timetables');
      const timetables = response.data;
      
      // Format times and populate related data
      const populatedTimetables = await Promise.all(
        timetables.map(async (timetable) => {
          try {
            const [classData, subjectData, teacherData] = await Promise.all([
              timetable.classId ? this.getClassById(timetable.classId).catch(() => null) : null,
              timetable.subjectId ? this.getSubjectById(timetable.subjectId).catch(() => null) : null,
              timetable.teacherId ? this.getTeacherById(timetable.teacherId).catch(() => null) : null,
            ]);

            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: classData,
              subject: subjectData,
              teacher: teacherData,
            };
          } catch (error) {
            console.warn(`Failed to populate data for timetable ${timetable.timetableId}:`, error);
            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: null,
              subject: null,
              teacher: null,
            };
          }
        })
      );

      return populatedTimetables;
    } catch (error) {
      console.error('Error fetching timetables:', error);
      throw new Error('Failed to fetch timetables');
    }
  }

  // Get timetable by ID
  async getTimetableById(id: number): Promise<Timetable> {
    try {
      const response = await api.get<Timetable>(`/timetables/${id}`);
      const timetable = response.data;
      
      // Populate related data
      try {
        const [classData, subjectData, teacherData] = await Promise.all([
          timetable.classId ? this.getClassById(timetable.classId).catch(() => null) : null,
          timetable.subjectId ? this.getSubjectById(timetable.subjectId).catch(() => null) : null,
          timetable.teacherId ? this.getTeacherById(timetable.teacherId).catch(() => null) : null,
        ]);

        return {
          ...timetable,
          startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
          endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
          class: classData,
          subject: subjectData,
          teacher: teacherData,
        };
      } catch (error) {
        console.warn(`Failed to populate data for timetable ${id}:`, error);
        return {
          ...timetable,
          startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
          endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
          class: null,
          subject: null,
          teacher: null,
        };
      }
    } catch (error) {
      console.error(`Error fetching timetable ${id}:`, error);
      throw new Error(`Failed to fetch timetable with ID ${id}`);
    }
  }

  // Get timetables by class ID
  async getTimetablesByClass(classId: number): Promise<Timetable[]> {
    try {
      const response = await api.get<Timetable[]>(`/timetables/class/${classId}`);
      const timetables = response.data;
      
      // Format times and populate related data
      const populatedTimetables = await Promise.all(
        timetables.map(async (timetable) => {
          try {
            const [classData, subjectData, teacherData] = await Promise.all([
              timetable.classId ? this.getClassById(timetable.classId).catch(() => null) : null,
              timetable.subjectId ? this.getSubjectById(timetable.subjectId).catch(() => null) : null,
              timetable.teacherId ? this.getTeacherById(timetable.teacherId).catch(() => null) : null,
            ]);

            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: classData,
              subject: subjectData,
              teacher: teacherData,
            };
          } catch (error) {
            console.warn(`Failed to populate data for timetable ${timetable.timetableId}:`, error);
            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: null,
              subject: null,
              teacher: null,
            };
          }
        })
      );

      return populatedTimetables;
    } catch (error) {
      console.error(`Error fetching timetables for class ${classId}:`, error);
      throw new Error(`Failed to fetch timetables for class ${classId}`);
    }
  }

  // Get timetables by teacher ID
  async getTimetablesByTeacher(teacherId: number): Promise<Timetable[]> {
    try {
      const response = await api.get<Timetable[]>(`/timetables/teacher/${teacherId}`);
      const timetables = response.data;
      
      // Format times and populate related data
      const populatedTimetables = await Promise.all(
        timetables.map(async (timetable) => {
          try {
            const [classData, subjectData, teacherData] = await Promise.all([
              timetable.classId ? this.getClassById(timetable.classId).catch(() => null) : null,
              timetable.subjectId ? this.getSubjectById(timetable.subjectId).catch(() => null) : null,
              timetable.teacherId ? this.getTeacherById(timetable.teacherId).catch(() => null) : null,
            ]);

            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: classData,
              subject: subjectData,
              teacher: teacherData,
            };
          } catch (error) {
            console.warn(`Failed to populate data for timetable ${timetable.timetableId}:`, error);
            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: null,
              subject: null,
              teacher: null,
            };
          }
        })
      );

      return populatedTimetables;
    } catch (error) {
      console.error(`Error fetching timetables for teacher ${teacherId}:`, error);
      throw new Error(`Failed to fetch timetables for teacher ${teacherId}`);
    }
  }

  // Get timetables by weekday
  async getTimetablesByWeekday(weekday: string): Promise<Timetable[]> {
    try {
      const response = await api.get<Timetable[]>(`/timetables/weekday/${weekday}`);
      const timetables = response.data;
      
      // Format times and populate related data
      const populatedTimetables = await Promise.all(
        timetables.map(async (timetable) => {
          try {
            const [classData, subjectData, teacherData] = await Promise.all([
              timetable.classId ? this.getClassById(timetable.classId).catch(() => null) : null,
              timetable.subjectId ? this.getSubjectById(timetable.subjectId).catch(() => null) : null,
              timetable.teacherId ? this.getTeacherById(timetable.teacherId).catch(() => null) : null,
            ]);

            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: classData,
              subject: subjectData,
              teacher: teacherData,
            };
          } catch (error) {
            console.warn(`Failed to populate data for timetable ${timetable.timetableId}:`, error);
            return {
              ...timetable,
              startTime: timetable.startTime ? this.formatTimeFromBackend(timetable.startTime) : null,
              endTime: timetable.endTime ? this.formatTimeFromBackend(timetable.endTime) : null,
              class: null,
              subject: null,
              teacher: null,
            };
          }
        })
      );

      return populatedTimetables;
    } catch (error) {
      console.error(`Error fetching timetables for ${weekday}:`, error);
      throw new Error(`Failed to fetch timetables for ${weekday}`);
    }
  }

  // Create new timetable
  async createTimetable(timetableData: CreateTimetableDto): Promise<Timetable> {
    try {
      // Generate timetableId if not provided
      const timetableId = timetableData.timetableId || await this.getNextTimetableId();
      
      const dataToSend = {
        ...timetableData,
        timetableId,
        startTime: this.formatTimeForBackend(timetableData.startTime),
        endTime: this.formatTimeForBackend(timetableData.endTime),
      };

      const response = await api.post<Timetable>('/timetables', dataToSend);
      const newTimetable = response.data;
      
      // Fetch and populate related data for the newly created timetable
      try {
        const [classData, subjectData, teacherData] = await Promise.all([
          newTimetable.classId ? this.getClassById(newTimetable.classId).catch(() => null) : null,
          newTimetable.subjectId ? this.getSubjectById(newTimetable.subjectId).catch(() => null) : null,
          newTimetable.teacherId ? this.getTeacherById(newTimetable.teacherId).catch(() => null) : null,
        ]);

        return {
          ...newTimetable,
          startTime: newTimetable.startTime ? this.formatTimeFromBackend(newTimetable.startTime) : null,
          endTime: newTimetable.endTime ? this.formatTimeFromBackend(newTimetable.endTime) : null,
          class: classData,
          subject: subjectData,
          teacher: teacherData,
        };
      } catch (error) {
        console.warn(`Failed to populate data for new timetable ${newTimetable.timetableId}:`, error);
        return {
          ...newTimetable,
          startTime: newTimetable.startTime ? this.formatTimeFromBackend(newTimetable.startTime) : null,
          endTime: newTimetable.endTime ? this.formatTimeFromBackend(newTimetable.endTime) : null,
          class: null,
          subject: null,
          teacher: null,
        };
      }
    } catch (error) {
      console.error('Error creating timetable:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to create timetable');
      }
      throw new Error('Failed to create timetable');
    }
  }

  // Update existing timetable
  async updateTimetable(id: number, timetableData: UpdateTimetableDto): Promise<void> {
    try {
      const dataToSend = {
        ...timetableData,
        startTime: this.formatTimeForBackend(timetableData.startTime),
        endTime: this.formatTimeForBackend(timetableData.endTime),
      };
      
      await api.put(`/timetables/${id}`, dataToSend);
    } catch (error) {
      console.error(`Error updating timetable ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to update timetable');
      }
      throw new Error(`Failed to update timetable with ID ${id}`);
    }
  }

  // Delete timetable
  async deleteTimetable(id: number): Promise<void> {
    try {
      await api.delete(`/timetables/${id}`);
    } catch (error) {
      console.error(`Error deleting timetable ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to delete timetable');
      }
      throw new Error(`Failed to delete timetable with ID ${id}`);
    }
  }

  // Utility method to check for schedule conflicts
  async checkScheduleConflict(
    classId: number,
    teacherId: number,
    weekday: string,
    startTime: string,
    endTime: string,
    excludeTimetableId?: number
  ): Promise<boolean> {
    try {
      const classTimetables = await this.getTimetablesByClass(classId);
      const teacherTimetables = await this.getTimetablesByTeacher(teacherId);
      
      const allConflicts = [...classTimetables, ...teacherTimetables]
        .filter(t => t.weekday?.toLowerCase() === weekday.toLowerCase())
        .filter(t => excludeTimetableId ? t.timetableId !== excludeTimetableId : true);

      for (const timetable of allConflicts) {
        if (this.isTimeOverlap(startTime, endTime, timetable.startTime!, timetable.endTime!)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking schedule conflict:', error);
      return false;
    }
  }

  // Helper method to check time overlap
  private isTimeOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const start1Time = new Date(`2000-01-01 ${start1}`);
    const end1Time = new Date(`2000-01-01 ${end1}`);
    const start2Time = new Date(`2000-01-01 ${start2}`);
    const end2Time = new Date(`2000-01-01 ${end2}`);

    return start1Time < end2Time && start2Time < end1Time;
  }

  // Format time for display
  formatTimeSlot(startTime: string, endTime: string): string {
    const formatTime = (time: string) => {
      const date = new Date(`2000-01-01 ${time}`);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
    };
    
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  }
}

export const timetableService = new TimetableService();