"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import useBehaviour from "@/teacher/hooks/useBehaviour"

const SEVERITIES = ["Severe", "Moderate", "Minor"]

export default function BehaviourPage() {
  const { students, filteredStudents, selectedStudentId, setSelectedStudentId, behaviours, isLoading, error, add, update, remove } = useBehaviour()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editing, setEditing] = useState<{ id: number | null }>({ id: null })
  const [form, setForm] = useState({
    IncidentDate: new Date().toISOString().slice(0, 10), // Default to today's date
    BehaviourCategory: "",
    Severity: "Moderate",
    Description: "",
  })

  // Show all behaviours (no filtering by student)
  const filteredBehaviours = useMemo(() => {
    return behaviours
  }, [behaviours])

  const openCreate = () => {
    setForm({ 
      IncidentDate: new Date().toISOString().slice(0, 10), 
      BehaviourCategory: "", 
      Severity: "Moderate", 
      Description: "" 
    })
    setEditing({ id: null })
    setIsModalOpen(true)
  }

  const openEdit = (b: any) => {
    setForm({
      IncidentDate: (b?.IncidentDate || "").toString().slice(0, 10),
      BehaviourCategory: b?.BehaviourCategory || "",
      Severity: b?.Severity || "Moderate",
      Description: b?.Description || "",
    })
    // Set the selected student to match the behaviour being edited
    if (b?.StudentId) {
      setSelectedStudentId(b.StudentId)
    }
    setEditing({ id: b?.BehaviourId })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId) {
      alert("Please select a student")
      return
    }
    if (!form.BehaviourCategory.trim()) {
      alert("Please enter a behaviour category")
      return
    }
    if (!form.Description.trim()) {
      alert("Please enter a description")
      return
    }
    
    setIsSubmitting(true)
    try {
      if (editing.id) {
        await update(editing.id, form)
      } else {
        await add(form)
      }
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset page when behaviours change
  const [page, setPage] = useState(1)
  const pageSize = 10
  
  useEffect(() => {
    setPage(1) // Reset to first page when behaviours change
  }, [behaviours.length])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredBehaviours.slice(start, start + pageSize)
  }, [filteredBehaviours, page])
  
  const totalPages = Math.max(1, Math.ceil(filteredBehaviours.length / pageSize))

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Behaviour Records</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage behaviour records for your students ({behaviours.length} total records)
              </p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} disabled={filteredStudents.length === 0}>
                  Add Behaviour Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>{editing.id ? "Edit Behaviour Record" : "Add New Behaviour Record"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="student-select">Student *</Label>
                    <Select
                      value={selectedStudentId?.toString() ?? ""}
                      onValueChange={(v) => setSelectedStudentId(Number(v))}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-64">
                        {filteredStudents.map((s) => (
                          <SelectItem key={s.StudentId} value={String(s.StudentId)}>
                            {s.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="incident-date">Incident Date *</Label>
                    <Input 
                      id="incident-date"
                      type="date" 
                      value={form.IncidentDate} 
                      onChange={(e) => setForm({ ...form, IncidentDate: e.target.value })}
                      max={new Date().toISOString().slice(0, 10)} // Prevent future dates
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Behaviour Category *</Label>
                    <Input 
                      id="category"
                      value={form.BehaviourCategory} 
                      onChange={(e) => setForm({ ...form, BehaviourCategory: e.target.value })}
                      placeholder="e.g., Disruption, Tardiness, Inappropriate language"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="severity">Severity Level *</Label>
                    <Select value={form.Severity} onValueChange={(v) => setForm({ ...form, Severity: v })}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {SEVERITIES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description"
                      value={form.Description} 
                      onChange={(e) => setForm({ ...form, Description: e.target.value })}
                      placeholder="Describe the incident in detail..."
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : editing.id ? "Update Record" : "Create Record"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}
          
          {isLoading && (
            <div className="text-center py-4 text-gray-600">
              Loading behaviour records...
            </div>
          )}
          
          {filteredStudents.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <p>No students found for your classes.</p>
              <p className="text-sm">Contact your administrator if this seems incorrect.</p>
            </div>
          )}
          
          {filteredStudents.length > 0 && !isLoading && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="w-32">Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-24">Severity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No behaviour records found. Click "Add Behaviour Record" to create the first one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paged.map((x) => (
                        <TableRow key={x.BehaviourId}>
                          <TableCell className="font-mono text-sm">{x.BehaviourId}</TableCell>
                          <TableCell className="font-medium">
                            {students.find((s) => s.StudentId === x.StudentId)?.Name || `Student #${x.StudentId}`}
                          </TableCell>
                          <TableCell>{formatDate(String(x.IncidentDate))}</TableCell>
                          <TableCell>{x.BehaviourCategory}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              x.Severity === 'Severe' ? 'bg-red-100 text-red-800' :
                              x.Severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {x.Severity}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={x.Description}>
                              {x.Description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => openEdit(x)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this behaviour record? This action cannot be undone.")) {
                                    remove(x.BehaviourId)
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, behaviours.length)} of {behaviours.length} records
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === 1} 
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page >= totalPages} 
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}