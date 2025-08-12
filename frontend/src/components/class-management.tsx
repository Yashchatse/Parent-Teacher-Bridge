"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, Search, Edit, Trash2, School, Loader2, AlertCircle } from "lucide-react"
import { useClass } from "../hooks/useClass"
import { Alert, AlertDescription } from "./ui/alert"

interface ClassType {
  classId: number
  className: string
  classTeacherId: number | null
  createdAt?: string
  updatedAt?: string
}

interface TeacherType {
  teacherId: number
  name: string
}

export function ClassManagement() {
  const {
    classes,
    teachers,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    getTeacherName,
  } = useClass();

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [editingClass, setEditingClass] = useState<ClassType | null>(null)
  const [formData, setFormData] = useState<{ className: string; classTeacherId: string | null }>({ 
    className: "", 
    classTeacherId: "none"
  })
  const [formLoading, setFormLoading] = useState<boolean>(false)

  const filteredClasses = classes.filter(
    (cls: ClassType) =>
      cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTeacherName(cls.classTeacherId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormData({ className: "", classTeacherId: "none" })
    setEditingClass(null)
  }

  const handleAddClass = async () => {
    if (!formData.className.trim()) {
      return;
    }

    setFormLoading(true)
    try {
      await createClass({
        className: formData.className,
        classTeacherId: formData.classTeacherId === "none" ? null : parseInt(formData.classTeacherId as string)
      })
      resetForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to create class:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditClass = (cls: ClassType) => {
    setEditingClass(cls)
    setFormData({
      className: cls.className,
      // Fix: Handle null classTeacherId properly
      classTeacherId: cls.classTeacherId ? cls.classTeacherId.toString() : "none"
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateClass = async () => {
    if (!formData.className.trim() || !editingClass) {
      return;
    }

    setFormLoading(true)
    try {
      await updateClass(editingClass.classId, {
        className: formData.className,
        classTeacherId: formData.classTeacherId === "none" ? null : parseInt(formData.classTeacherId as string)
      })
      resetForm()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update class:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClass = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(id)
      } catch (error) {
        console.error('Failed to delete class:', error)
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        <span className="ml-2 text-white">Loading classes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <School className="h-8 w-8 mr-3 text-yellow-400" />
          Class Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="className" className="text-gray-300">
                  Class Name *
                </Label>
                <Input
                  id="className"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Grade 3-A"
                  required
                />
              </div>
              <div>
                <Label htmlFor="classTeacher" className="text-gray-300">
                  Class Teacher (Optional)
                </Label>
                <Select
                  value={formData.classTeacherId?.toString() || "none"}
                  onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="none">No Teacher Assigned</SelectItem>
                    {(teachers || []).map((teacher: TeacherType) => (
                      <SelectItem 
                        key={teacher.teacherId} 
                        value={teacher.teacherId.toString()}
                        className="text-white hover:bg-gray-600"
                      >
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddClass} 
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                disabled={formLoading || !formData.className.trim()}
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Class'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert className="bg-red-900/50 border-red-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Class List</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Class Name</TableHead>
                <TableHead className="text-gray-300">Class Teacher</TableHead>
                <TableHead className="text-gray-300">Created Date</TableHead>
                <TableHead className="text-gray-300">Updated Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls: ClassType) => (
                <TableRow key={cls.classId} className="border-gray-700">
                  <TableCell className="text-white">{cls.classId}</TableCell>
                  <TableCell className="text-white font-medium">{cls.className}</TableCell>
                  <TableCell className="text-white">{getTeacherName(cls.classTeacherId)}</TableCell>
                  <TableCell className="text-white">{formatDate(cls.createdAt)}</TableCell>
                  <TableCell className="text-white">{formatDate(cls.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        onClick={() => handleEditClass(cls)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                        onClick={() => handleDeleteClass(cls.classId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredClasses.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-8">
              No classes found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editClassName" className="text-gray-300">
                Class Name *
              </Label>
              <Input
                id="editClassName"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Grade 3-A"
                required
              />
            </div>
            <div>
              <Label htmlFor="editClassTeacher" className="text-gray-300">
                Class Teacher (Optional)
              </Label>
              <Select
                value={formData.classTeacherId?.toString() || "none"}
                onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="none">No Teacher Assigned</SelectItem>
                  {(teachers || []).map((teacher: TeacherType) => (
                    <SelectItem 
                      key={teacher.teacherId} 
                      value={teacher.teacherId.toString()}
                      className="text-white hover:bg-gray-600"
                    >
                                              {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleUpdateClass} 
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                disabled={formLoading || !formData.className.trim()}
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Class'
                )}
              </Button>
              <Button 
                onClick={() => {
                  resetForm()
                  setIsEditDialogOpen(false)
                }} 
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
