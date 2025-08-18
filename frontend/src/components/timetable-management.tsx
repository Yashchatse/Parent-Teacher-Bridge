"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Plus, Calendar, Clock, AlertTriangle, Loader2, X } from "lucide-react"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { useTimetable } from "../hooks/useTimetable"
import { CreateTimetableDto, SchoolClass, Subject, Teacher } from "../services/timetableSerivce"

interface TimeSlot {
  startTime: string;
  endTime: string;
}

// Days of the week
const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Time slots - you can customize these based on your school schedule
const timeSlots: TimeSlot[] = [
  { startTime: "08:00", endTime: "08:45" },
  { startTime: "08:50", endTime: "09:35" },
  { startTime: "09:40", endTime: "10:25" },
  { startTime: "10:45", endTime: "11:30" },
  { startTime: "11:35", endTime: "12:20" },
  { startTime: "13:00", endTime: "13:45" },
  { startTime: "13:50", endTime: "14:35" },
  { startTime: "14:40", endTime: "15:25" },
];

export default function TimetableManagement() {

  const {
    timetables,
    classes,
    subjects,
    teachers,
    loading,
    error,
    createTimetable,
    deleteTimetable,
    checkScheduleConflict,
    refresh
  } = useTimetable()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<number>(0)
  const [conflictCheck, setConflictCheck] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [newSchedule, setNewSchedule] = useState({
    weekday: "",
    startTime: "",
    endTime: "",
    classId: "",
    subjectId: "",
    teacherId: "",
  })

  // Set default selected class when classes are loaded
  useEffect(() => {
    if (classes.length > 0 && selectedClassId === 0) {
      setSelectedClassId(classes[0].classId)
    }
  }, [classes, selectedClassId])

  // Debug logging for dropdowns
  useEffect(() => {
    console.log('Classes:', classes);
    console.log('Subjects:', subjects);
    console.log('Teachers:', teachers);
  }, [classes, subjects, teachers]);

  // Get selected class name
  const getSelectedClassName = () => {
    const selectedClass = classes.find((c: SchoolClass) => c.classId === selectedClassId)
    return selectedClass ? selectedClass.className : "Select a Class"
  }

  // Enrich timetable data with subject and teacher info
  const getClassTimetables = () => {
    return timetables
      .filter(t => t.classId === selectedClassId)
      .map(t => {
        const subject = subjects.find(s => s.subjectId === t.subjectId);
        const teacher = teachers.find(te => te.teacherId === t.teacherId);

        return {
          ...t,
          subject,
          teacher,
        };
      });
  };

  const handleAddSchedule = async () => {
    try {
      setFormError(null)

      // Validate form
      if (!newSchedule.weekday || !newSchedule.startTime || !newSchedule.endTime ||
        !newSchedule.classId || !newSchedule.subjectId || !newSchedule.teacherId) {
        setFormError("Please fill in all fields")
        return
      }

      // Validate time logic
      if (newSchedule.startTime >= newSchedule.endTime) {
        setFormError("Start time must be before end time")
        return
      }

      setConflictCheck(true)

      // Check for conflicts using the backend service
      const hasConflict = await checkScheduleConflict(
        parseInt(newSchedule.classId),
        parseInt(newSchedule.teacherId),
        newSchedule.weekday,
        newSchedule.startTime,
        newSchedule.endTime
      )

      if (hasConflict) {
        setFormError("Schedule conflict detected! This time slot is already occupied by the class or teacher.")
        return
      }

      // Create new timetable entry
      const createData: CreateTimetableDto = {
        classId: parseInt(newSchedule.classId),
        subjectId: parseInt(newSchedule.subjectId),
        teacherId: parseInt(newSchedule.teacherId),
        weekday: newSchedule.weekday,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime
      }

      console.log('Creating timetable with data:', createData);
      await createTimetable(createData)

      // Reset form and close dialog
      setNewSchedule({
        weekday: "",
        startTime: "",
        endTime: "",
        classId: "",
        subjectId: "",
        teacherId: "",
      })
      setIsAddDialogOpen(false)

    } catch (err) {
      console.error('Error creating schedule:', err);
      setFormError(err instanceof Error ? err.message : "Failed to add schedule. Please try again.")
    } finally {
      setConflictCheck(false)
    }
  }

  const handleRemoveSchedule = async (timetableId: number) => {
    if (window.confirm("Are you sure you want to remove this schedule?")) {
      try {
        await deleteTimetable(timetableId)
      } catch (err) {
        console.error("Failed to delete timetable:", err)
      }
    }
  }

  const getScheduleForSlot = (day: string, timeSlot: TimeSlot) => {
    return getClassTimetables().find((item) =>
      item.weekday?.toLowerCase() === day.toLowerCase() &&
      item.startTime?.slice(0, 5) === timeSlot.startTime &&
      item.endTime?.slice(0, 5) === timeSlot.endTime
    )
  }

  const getSubjectColor = (subjectName: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-600",
      Physics: "bg-green-600",
      Chemistry: "bg-purple-600",
      Biology: "bg-yellow-600",
      English: "bg-pink-600",
      History: "bg-indigo-600",
      Geography: "bg-orange-600",
      "Computer Science": "bg-red-600",
    }
    return colors[subjectName] || "bg-gray-600"
  }

  const formatTimeSlot = (startTime: string, endTime: string) => {
    return `${startTime}-${endTime}`
  }

  // Show loading state if data is still loading
  if (loading && classes.length === 0 && subjects.length === 0 && teachers.length === 0) {
    return (
      <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
          <span className="ml-4 text-gray-300 text-xl">Loading timetable data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      {/* Error Display */}
      {(error || formError) && (
        <Alert className="bg-red-900/50 border-red-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            {error || formError}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFormError(null)
              }}
              className="ml-2 h-6 w-6 p-0 text-red-200 hover:text-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Calendar className="h-8 w-8 mr-3 text-indigo-400" />
          Timetable Management
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(parseInt(e.target.value))}
            className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            disabled={classes.length === 0}
          >
            <option value={0}>Select Class</option>
            {classes.map((cls: SchoolClass) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.className}
              </option>
            ))}
          </select>

          <Button
            onClick={refresh}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={loading || classes.length === 0 || subjects.length === 0 || teachers.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Schedule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="weekday" className="text-gray-300">
                    Day
                  </Label>
                  <select
                    id="weekday"
                    value={newSchedule.weekday}
                    onChange={(e) => setNewSchedule({ ...newSchedule, weekday: e.target.value })}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Select Day</option>
                    {days.map((day: string) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime" className="text-gray-300">
                      Start Time
                    </Label>
                    <select
                      id="startTime"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="">Start</option>
                      {timeSlots.map((slot: TimeSlot) => (
                        <option key={slot.startTime} value={slot.startTime}>
                          {slot.startTime}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-gray-300">
                      End Time
                    </Label>
                    <select
                      id="endTime"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="">End</option>
                      {timeSlots.map((slot: TimeSlot) => (
                        <option key={slot.endTime} value={slot.endTime}>
                          {slot.endTime}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="classId" className="text-gray-300">
                    Class ({classes.length} classes available)
                  </Label>
                  <select
                    id="classId"
                    value={newSchedule.classId}
                    onChange={(e) => {
                      console.log('Selected class ID:', e.target.value);
                      setNewSchedule({ ...newSchedule, classId: e.target.value });
                    }}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls: SchoolClass) => (
                      <option key={cls.classId} value={cls.classId}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                  {classes.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">No classes available. Please add classes first.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subjectId" className="text-gray-300">
                    Subject ({subjects.length} subjects available)
                  </Label>
                  <select
                    id="subjectId"
                    value={newSchedule.subjectId}
                    onChange={(e) => {
                      console.log('Selected subject ID:', e.target.value);
                      console.log('Available subjects:', subjects);
                      setNewSchedule({ ...newSchedule, subjectId: e.target.value });
                    }}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects && subjects.length > 0 ? (
                      subjects.map((subject: any) => (
                        <option key={`subject-${subject.subjectId}`} value={subject.subjectId}>
                          {subject.name || subject.subjectName || `Subject ${subject.subjectId}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading subjects...</option>
                    )}
                  </select>
                  {subjects.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">No subjects available. Please add subjects first.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="teacherId" className="text-gray-300">
                    Teacher ({teachers.length} teachers available)
                  </Label>
                  <select
                    id="teacherId"
                    value={newSchedule.teacherId}
                    onChange={(e) => {
                      console.log('Selected teacher ID:', e.target.value);
                      console.log('Available teachers:', teachers);
                      setNewSchedule({ ...newSchedule, teacherId: e.target.value });
                    }}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Select Teacher</option>
                    {teachers && teachers.length > 0 ? (
                      teachers.map((teacher: any) => (
                        <option key={`teacher-${teacher.teacherId}`} value={teacher.teacherId}>
                          {teacher.name || `${teacher.firstName} ${teacher.lastName}` || `Teacher ${teacher.teacherId}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading teachers...</option>
                    )}
                  </select>
                  {teachers.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">No teachers available. Please add teachers first.</p>
                  )}
                </div>

                <Button
                  onClick={handleAddSchedule}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading || conflictCheck}
                >
                  {loading || conflictCheck ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {conflictCheck ? "Checking Conflicts..." : "Adding..."}
                    </>
                  ) : (
                    "Add Schedule"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Weekly Timetable Grid */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Weekly Timetable - {getSelectedClassName()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedClassId === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Please select a class to view timetable
            </div>
          ) : loading && timetables.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              <span className="ml-2 text-gray-300">Loading timetables...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-600 p-3 text-gray-300 bg-gray-700">Time</th>
                    {days.map((day: string) => (
                      <th key={day} className="border border-gray-600 p-3 text-gray-300 bg-gray-700 min-w-[150px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot: TimeSlot) => (
                    <tr key={`${timeSlot.startTime}-${timeSlot.endTime}`}>
                      <td className="border border-gray-600 p-3 text-white bg-gray-700 font-medium">
                        {formatTimeSlot(timeSlot.startTime, timeSlot.endTime)}
                      </td>
                      {days.map((day: string) => {
                        const schedule = getScheduleForSlot(day, timeSlot);
                        return (
                          <td key={`${day}-${timeSlot.startTime}`} className="border border-gray-600 p-2">
                            {schedule ? (
                              <div className={`p-2 rounded text-white text-sm ${getSubjectColor(schedule.subject?.name || '')}`}>
                                <div className="font-medium">{schedule.subject?.name}</div>
                                <div className="text-xs opacity-90">
                                  {schedule.teacher?.name}
                                </div>
                              </div>
                            ) : (
                              <div className="h-16 flex items-center justify-center text-gray-500">Free</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Schedules List */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">All Schedules ({timetables.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timetables.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No schedules found. Add some schedules to get started.
              </div>
            ) : (
              timetables.map((schedule) => (
                <div key={schedule.timetableId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4 flex-wrap gap-2">
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {schedule.weekday}
                    </Badge>
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {formatTimeSlot(schedule.startTime || '', schedule.endTime || '')}
                    </Badge>
                    <span className="text-white">{schedule.class?.className}</span>
                    <span className="text-blue-400">{schedule.subject?.name}</span>
                    <span className="text-gray-300">
                      {schedule.teacher?.name} 
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                    onClick={() => handleRemoveSchedule(schedule.timetableId)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Remove"
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}