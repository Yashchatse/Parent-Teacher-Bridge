"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Plus, Search, Edit, Trash2, BookOpen, Loader2 } from "lucide-react"
import { useSubject } from "../hooks/useSubject"

// Define Subject type interface
interface Subject {
  subjectId:  number
  name: string
  code: string
  createdAt?: string | Date
}

export function SubjectManagement() {
  const {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    searchSubjects
  } = useSubject()

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [newSubject, setNewSubject] = useState({ name: "", code: "" })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const filteredSubjects = (subjects as Subject[]).filter(
    (subject) =>
      subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) 
      
  )

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
      alert("Name and Code are required fields")
      return
    }

    setFormLoading(true)
    try {
      await createSubject({
        name: newSubject.name,
        code: newSubject.code,
        // description: newSubject.description
      })
      setNewSubject({ name: "", code: "" })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add subject:", error)
      alert("Failed to add subject. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditSubject = async () => {
    if (!editingSubject?.name || !editingSubject?.code) {
      alert("Name and Code are required fields")
      return
    }

    setFormLoading(true)
    try {
      await updateSubject(editingSubject.subjectId, {
        name: editingSubject.name,
        code: editingSubject.code,
        // description: editingSubject.description
      })
      setIsEditDialogOpen(false)
      setEditingSubject(null)
    } catch (error) {
      console.error("Failed to update subject:", error)
      alert("Failed to update subject. Please try again.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteSubject = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await deleteSubject(id)
      } catch (error) {
        console.error("Failed to delete subject:", error)
        alert("Failed to delete subject. Please try again.")
      }
    }
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject({ ...subject })
    setIsEditDialogOpen(true)
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        await searchSubjects(searchTerm)
      } catch (error) {
        console.error("Search failed:", error)
      }
    } else {
      fetchSubjects()
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  if (loading && subjects.length === 0) {
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
          <BookOpen className="h-8 w-8 mr-3 text-pink-400" />
          Subject Management
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Subject Name *
                </Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <Label htmlFor="code" className="text-gray-300">
                  Subject Code *
                </Label>
                <Input
                  id="code"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., MATH101"
                />
              </div>
              
              <Button 
                onClick={handleAddSubject} 
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Subject"
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
            <DialogTitle className="text-white">Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-gray-300">
                Subject Name *
              </Label>
              <Input
                id="edit-name"
                value={editingSubject?.name || ""}
                onChange={(e) => setEditingSubject(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-code" className="text-gray-300">
                Subject Code *
              </Label>
              <Input
                id="edit-code"
                value={editingSubject?.code || ""}
                onChange={(e) => setEditingSubject(prev => prev ? { ...prev, code: e.target.value } : null)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <Button 
              onClick={handleEditSubject} 
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subject"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="bg-red-900/20 border border-red-600 text-red-400 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Subject List</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search subjects..."
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
              <span className="ml-2 text-gray-300">Loading subjects...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Subject Name</TableHead>
                  <TableHead className="text-gray-300">Code</TableHead>
                  {/* <TableHead className="text-gray-300">Description</TableHead> */}
                  <TableHead className="text-gray-300">Created At</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No subjects found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => (
                    <TableRow key={subject.subjectId} className="border-gray-700">
                      <TableCell className="text-white">{subject.subjectId}</TableCell>
                      <TableCell className="text-white font-medium">{subject.name}</TableCell>
                      <TableCell className="text-white">{subject.code}</TableCell>
                      {/* <TableCell className="text-white">{subject.description || "—"}</TableCell> */}
                      <TableCell className="text-white">
                        {subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                            onClick={() => openEditDialog(subject)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                            onClick={() => handleDeleteSubject(subject.subjectId)}
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
