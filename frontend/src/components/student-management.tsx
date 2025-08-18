"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, Search, Edit, Trash2, Users, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useStudent } from "../hooks/useStudent"
import { classService } from "../services/classService"

// Define Student type interface
interface Student {
  studentId: number
  name: string
  dob?: string
  gender?: string
  enrollmentNo?: string
  bloodGroup?: string
  classId?: number
  profilePhoto?: string
  createdAt?: string
  updatedAt?: string
}

interface SchoolClass {
  classId: number
  className?: string
  section?: string
}

// Ensures dates are formatted as YYYY-MM-DD for inputs and API payloads
function formatDateYMD(value: string | undefined): string {
  if (!value) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(value)
  if (isNaN(date.getTime())) return ""
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function StudentManagement() {
  const {
    students,
    loading,
    error,
    successMessage,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    clearError,
    clearSuccessMessage
  } = useStudent()

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [newStudent, setNewStudent] = useState({ 
    name: "", 
    dob: "", 
    gender: "", 
    enrollmentNo: "", 
    bloodGroup: "", 
    classId: 0 
  })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  useEffect(() => {
    classService.getAllClasses()
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load classes:', err))
  }, [])

  const filteredStudents = (students as Student[]).filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.enrollmentNo || !newStudent.classId) {
      alert("Name, Enrollment Number and Class are required")
      return
    }

    setFormLoading(true)
    try {
      const success = await createStudent({
        name: newStudent.name,
        dob: newStudent.dob ? formatDateYMD(newStudent.dob) : undefined,
        gender: newStudent.gender || undefined,
        enrollmentNo: newStudent.enrollmentNo,
        bloodGroup: newStudent.bloodGroup || undefined,
        classId: newStudent.classId,
      })
      
      if (success) {
        setNewStudent({ name: "", dob: "", gender: "", enrollmentNo: "", bloodGroup: "", classId: 0 })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to add student:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditStudent = async () => {
    if (!editingStudent?.name || !editingStudent?.enrollmentNo) {
      alert("Name and Enrollment Number are required fields")
      return
    }

    setFormLoading(true)
    try {
      const success = await updateStudent(editingStudent.studentId, {
        name: editingStudent.name,
        dob: editingStudent.dob ? formatDateYMD(editingStudent.dob) : undefined,
        gender: editingStudent.gender,
        enrollmentNo: editingStudent.enrollmentNo,
        bloodGroup: editingStudent.bloodGroup,
        classId: editingStudent.classId,
      })
      
      if (success) {
        setIsEditDialogOpen(false)
        setEditingStudent(null)
      }
    } catch (error) {
      console.error("Failed to update student:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id)
      } catch (error) {
        console.error("Failed to delete student:", error)
      }
    }
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent({ ...student })
    setIsEditDialogOpen(true)
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        await searchStudents(searchTerm)
      } catch (error) {
        console.error("Search failed:", error)
      }
    } else {
      fetchStudents()
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Users className="h-8 w-8 mr-3 text-pink-400" />
          Student Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Student Name *
                </Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <Label htmlFor="enrollment" className="text-gray-300">
                  Enrollment Number *
                </Label>
                <Input
                  id="enrollment"
                  value={newStudent.enrollmentNo}
                  onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., EN001"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-gray-300">
                  Gender
                </Label>
                <Select value={newStudent.gender} onValueChange={(value) => setNewStudent({ ...newStudent, gender: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dob" className="text-gray-300">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={newStudent.dob}
                  onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="bloodGroup" className="text-gray-300">
                  Blood Group
                </Label>
                <Select value={newStudent.bloodGroup} onValueChange={(value) => setNewStudent({ ...newStudent, bloodGroup: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="classId" className="text-gray-300">
                  School Class *
                </Label>
                <Select
                  value={newStudent.classId ? String(newStudent.classId) : ""}
                  onValueChange={(val) => setNewStudent({ ...newStudent, classId: Number(val) })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.classId} value={String(c.classId)}>
                        {(c.className || `Class ${c.classId}`) + (c.section ? ` - ${c.section}` : "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddStudent} 
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-gray-300">
                Student Name *
              </Label>
              <Input
                id="edit-name"
                value={editingStudent?.name || ""}
                onChange={(e) => setEditingStudent(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-enrollment" className="text-gray-300">
                Enrollment Number *
              </Label>
              <Input
                id="edit-enrollment"
                value={editingStudent?.enrollmentNo || ""}
                onChange={(e) => setEditingStudent(prev => prev ? { ...prev, enrollmentNo: e.target.value } : null)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-gender" className="text-gray-300">
                Gender
              </Label>
              <Select 
                value={editingStudent?.gender || ""} 
                onValueChange={(value) => setEditingStudent(prev => prev ? { ...prev, gender: value } : null)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-dob" className="text-gray-300">
                Date of Birth
              </Label>
              <Input
                id="edit-dob"
                type="date"
                value={formatDateYMD(editingStudent?.dob)}
                onChange={(e) => setEditingStudent(prev => prev ? { ...prev, dob: e.target.value } : null)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-bloodGroup" className="text-gray-300">
                Blood Group
              </Label>
              <Select 
                value={editingStudent?.bloodGroup || ""} 
                onValueChange={(value) => setEditingStudent(prev => prev ? { ...prev, bloodGroup: value } : null)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleEditStudent} 
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Student"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-600 text-green-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearSuccessMessage}
            className="text-green-400 hover:text-green-300"
          >
            ×
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-600 text-red-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error: {error}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearError}
            className="text-red-400 hover:text-red-300"
          >
            ×
          </Button>
        </div>
      )}

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Student List</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-pink-400" />
              <span className="ml-2 text-gray-300">Loading students...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Enrollment No.</TableHead>
                  <TableHead className="text-gray-300">Gender</TableHead>
                  <TableHead className="text-gray-300">Blood Group</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.studentId} className="border-gray-700">
                      <TableCell className="text-white">{student.studentId}</TableCell>
                      <TableCell className="text-white font-medium">{student.name}</TableCell>
                      <TableCell className="text-white">{student.enrollmentNo}</TableCell>
                      <TableCell className="text-white">{student.gender || "—"}</TableCell>
                      <TableCell className="text-white">{student.bloodGroup || "—"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                            onClick={() => openEditDialog(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                            onClick={() => handleDeleteStudent(student.studentId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}