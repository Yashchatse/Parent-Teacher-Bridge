"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Plus, Search, Edit, Trash2, GraduationCap, Loader2, AlertCircle, UserCheck } from "lucide-react"
import { Badge } from "./ui/badge"
import { useTeachers } from "../hooks/useTeachers"
import { useToast } from "../hooks/use-toast"

// Define Teacher interface
interface Teacher {
  teacherId: number
  name: string
  email: string
  password?: string
  phone?: string
  gender?: string
  photo?: string
  qualification?: string
  experienceYears?: number
  isActive?: boolean
  createdAt?: string
}

export function TeacherManagement() {
  const { teachers, loading, error, createTeacher, updateTeacher, deleteTeacher, searchTeachers, clearError } = useTeachers()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [newTeacher, setNewTeacher] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phone: "",
    gender: "",
    qualification: "",
    experienceYears: 0,
    isActive: true
  })
  
  const initialNewTeacher = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    qualification: "",
    experienceYears: 0,
    isActive: true
  }

  // Form validation
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

    return (
      newTeacher.name.trim() !== '' &&
      emailRegex.test(newTeacher.email) &&
      passwordRegex.test(newTeacher.password)
    )
  }

  // Edit form validation
  const isEditFormValid = (teacher: Teacher) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    return (
      teacher.name?.trim() !== '' &&
      emailRegex.test(teacher.email || '')
    )
  }

  const filteredTeachers = teachers.filter(
    (teacher: Teacher) =>
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.qualification?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTeacher = async () => {
    if (!isFormValid()) {
      toast('Validation Error', 'Please fill in all required fields with valid data', {
        variant: 'destructive',
      })
      return
    }

    try {
      console.log('🔧 Attempting to create teacher with data:', newTeacher)
      await createTeacher(newTeacher)
      await searchTeachers("") // Refresh list
      toast('Success', 'Teacher created successfully!')
      setNewTeacher(initialNewTeacher)
      setIsAddDialogOpen(false)
    } catch (error: any) {
      console.error('❌ Failed to create teacher:', error)
      toast('Error', error.message || 'Failed to create teacher', {
        variant: 'destructive',
      })
    }
  }

  const handleUpdateTeacher = async (id: number, teacherData: Partial<Teacher>) => {
    try {
      // Add password field for update (required by backend)
      const updateData = {
        ...teacherData,
        password: teacherData.password || "TempPassword123!" // Provide a default password if not specified
      };
      
      if (!isEditFormValid(updateData as Teacher)) {
        toast('Validation Error', 'Please fill in all required fields with valid data', {
          variant: 'destructive',
        })
        return
      }

      console.log('🔧 Attempting to update teacher:', { id, updateData })
      await updateTeacher(id, updateData)
      toast('Success', 'Teacher updated successfully!')
      setEditingTeacher(null)
    } catch (error: any) {
      console.error('❌ Failed to update teacher:', error)
      toast('Error', error.message || 'Failed to update teacher', {
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return
    }

    try {
      console.log('🔧 Attempting to delete teacher:', id)
      await deleteTeacher(id)
      toast('Success', 'Teacher deleted successfully!')
    } catch (error: any) {
      console.error('❌ Failed to delete teacher:', error)
      toast('Error', error.message || 'Failed to delete teacher', {
        variant: 'destructive',
      })
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    try {
      console.log('🔍 Searching for:', term)
      await searchTeachers(term)
    } catch (error: any) {
      console.error('❌ Search failed:', error)
      toast('Error', 'Search failed', {
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <GraduationCap className="h-8 w-8 mr-3 text-blue-400" />
          Teacher Management
          {loading && <Loader2 className="h-5 w-5 ml-2 animate-spin text-blue-400" />}
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter teacher name"
                />
                {newTeacher.name.trim() === '' && (
                  <p className="text-red-400 text-sm mt-1">Name is required</p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter email address"
                />
                {newTeacher.email.trim() === '' && (
                  <p className="text-red-400 text-sm mt-1">Email is required</p>
                )}
                {newTeacher.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTeacher.email) && (
                  <p className="text-red-400 text-sm mt-1">Please enter a valid email address</p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter password"
                />
                {newTeacher.password.trim() === '' && (
                  <p className="text-red-400 text-sm mt-1">Password is required</p>
                )}
                {newTeacher.password.trim() !== '' &&
                  newTeacher.password.length < 8 && (
                    <p className="text-yellow-400 text-sm mt-1">Password must be at least 8 characters long</p>
                )}
                {newTeacher.password.trim() !== '' &&
                  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newTeacher.password) && (
                    <p className="text-yellow-400 text-sm mt-1">
                      Password must include uppercase, lowercase, digit, and special character
                    </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter phone number"
                  maxLength={10}
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-gray-300">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={newTeacher.gender}
                  onChange={(e) => setNewTeacher({ ...newTeacher, gender: e.target.value })}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="qualification" className="text-gray-300">
                  Qualification
                </Label>
                <Input
                  id="qualification"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter qualification"
                />
              </div>
              <div>
                <Label htmlFor="experienceYears" className="text-gray-300">
                  Experience (Years)
                </Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={newTeacher.experienceYears}
                  onChange={(e) => setNewTeacher({ ...newTeacher, experienceYears: parseInt(e.target.value) || 0 })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter years of experience"
                />
              </div>
              <Button 
                onClick={handleAddTeacher} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Teacher'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search teachers by name, email, or qualification..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      {/* Teachers List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Teachers List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Qualification</TableHead>
                <TableHead className="text-gray-300">Experience</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                    {loading ? 'Loading teachers...' : 'No teachers found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher: Teacher) => (
                  <TableRow key={teacher.teacherId} className="border-gray-700">
                    <TableCell className="text-white">{teacher.teacherId}</TableCell>
                    <TableCell className="text-white">{teacher.name}</TableCell>
                    <TableCell className="text-white">{teacher.email}</TableCell>
                    <TableCell className="text-white">{teacher.qualification || 'N/A'}</TableCell>
                    <TableCell className="text-white">
                      {teacher.experienceYears ? `${teacher.experienceYears} years` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.isActive ? "default" : "secondary"}>
                        {teacher.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          onClick={() => setEditingTeacher({...teacher, password: ""})}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                          onClick={() => handleDeleteTeacher(teacher.teacherId)}
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingTeacher && (
        <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-gray-300">Name *</Label>
                <Input
                  id="edit-name"
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-gray-300">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-password" className="text-gray-300">
                  Password (leave empty to keep current)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editingTeacher.password || ""}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, password: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter new password (optional)"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone" className="text-gray-300">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingTeacher.phone || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  maxLength={10}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor="edit-gender" className="text-gray-300">Gender</Label>
                <select
                  id="edit-gender"
                  value={editingTeacher.gender || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, gender: e.target.value })}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-qualification" className="text-gray-300">Qualification</Label>
                <Input
                  id="edit-qualification"
                  value={editingTeacher.qualification || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-experience" className="text-gray-300">Experience (Years)</Label>
                <Input
                  id="edit-experience"
                  type="number"
                  value={editingTeacher.experienceYears || 0}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, experienceYears: parseInt(e.target.value) || 0 })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-gray-300">Status</Label>
                <select
                  id="edit-status"
                  value={editingTeacher.isActive ? 'true' : 'false'}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, isActive: e.target.value === 'true' })}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <Button 
                onClick={() => handleUpdateTeacher(editingTeacher.teacherId, editingTeacher)} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!isEditFormValid(editingTeacher) || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Teacher'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}