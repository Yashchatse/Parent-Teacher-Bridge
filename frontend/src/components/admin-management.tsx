"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Plus, Search, Edit, Trash2, UserCheck, Loader2, AlertCircle, Bug } from "lucide-react"
import { useAdmins } from "../hooks/useAdmins"
import { useToast } from "../hooks/use-toast"
import { Label } from "./ui/label"
interface Admin {
  adminId: number
  name: string
  email: string
  status: string
  createdDate?: string
}

export function AdminManagement() {
  const { admins, loading, error, createAdmin, updateAdmin, deleteAdmin, searchAdmins, clearError } = useAdmins()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ 
    name: "", 
    email: "", 
    password: "",
    status: "Active"
  })
const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 10

  
  // Form validation
  const isFormValid = () => {
    return newAdmin.name.trim() !== '' && 
           newAdmin.email.trim() !== '' && 
           newAdmin.password.trim() !== '' &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email) // Basic email validation
  }

  const filteredAdmins = admins.filter(
    (admin: Admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddAdmin = async () => {
    if (!isFormValid()) {
      toast('Validation Error', 'Please fill in all required fields with valid data', {
        variant: 'destructive',
      })
      return
    }

    
    try {
      console.log('🔧 Attempting to create admin with data:', newAdmin)
      await createAdmin(newAdmin)
      toast('Success', 'Admin created successfully!', {})
      setNewAdmin({ 
        name: "", 
        email: "", 
        password: "",
        status: "Active"
      })
      setIsAddDialogOpen(false)
    } catch (error: any) {
      console.error('❌ Failed to create admin:', error)
      toast('Error', error.message || 'Failed to create admin', {
        variant: 'destructive',
      })
    }
  }

  const handleUpdateAdmin = async (id: number, adminData: Partial<Admin>) => {
    try {
      console.log('🔧 Attempting to update admin:', { id, adminData })
      await updateAdmin(id, adminData)
      toast('Success', 'Admin updated successfully!', {})
      setEditingAdmin(null)
    } catch (error: any) {
      console.error('❌ Failed to update admin:', error)
      toast('Error', error.message || 'Failed to update admin', {
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) {
      return
    }

    try {
      console.log('🔧 Attempting to delete admin:', id)
      await deleteAdmin(id)
      toast('Success', 'Admin deleted successfully!', {})
    } catch (error: any) {
      console.error('❌ Failed to delete admin:', error)
      toast('Error', error.message || 'Failed to delete admin', {
        variant: 'destructive',
      })
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim()) {
      try {
        console.log('🔍 Searching for:', term)
        await searchAdmins(term)
      } catch (error: any) {
        console.error('❌ Search failed:', error)
        toast('Error', 'Search failed', {
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <UserCheck className="h-8 w-8 mr-3 text-blue-400" />
          Admin Management
          {loading && <Loader2 className="h-5 w-5 ml-2 animate-spin text-blue-400" />}
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter admin name"
                />
                {newAdmin.name.trim() === '' && (
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
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter email address"
                />
                {newAdmin.email.trim() === '' && (
                  <p className="text-red-400 text-sm mt-1">Email is required</p>
                )}
                {newAdmin.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email) && (
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
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter password"
                />
                {newAdmin.password.trim() === '' && (
                  <p className="text-red-400 text-sm mt-1">Password is required</p>
                )}
                {newAdmin.password.trim() !== '' && newAdmin.password.length < 6 && (
                  <p className="text-yellow-400 text-sm mt-1">Password should be at least 6 characters</p>
                )}
              </div>
              <Button 
                onClick={handleAddAdmin} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Admin'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Admin List</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                {/* <TableHead className="text-gray-300">Status</TableHead> */}
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    {loading ? 'Loading admins...' : 'No admins found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin: Admin) => (
                  <TableRow key={admin.adminId} className="border-gray-700">
                    <TableCell className="text-white">{admin.adminId}</TableCell>
                    <TableCell className="text-white">{admin.name}</TableCell>
                    <TableCell className="text-white">{admin.email}</TableCell>
                    {/* <TableCell>
                      <Badge variant={admin.status === "Active" ? "default" : "secondary"}>
                        {admin.status}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          onClick={() => setEditingAdmin(admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                          onClick={() => handleDeleteAdmin(admin.adminId)}
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
      {editingAdmin && (
        <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-gray-300">Name</Label>
                <Input
                  id="edit-name"
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-gray-300">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button 
                onClick={() => handleUpdateAdmin(editingAdmin.adminId, editingAdmin)} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Update Admin
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
