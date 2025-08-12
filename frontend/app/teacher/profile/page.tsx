"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useTeacherProfile from "@/teacher/hooks/useTeacherProfile"

export default function ProfilePage() {
  const { profile, isLoading, error, refetch } = useTeacherProfile()

  const displayError = (errorValue: any): string => {
    if (typeof errorValue === 'string') return errorValue
    if (errorValue?.message) return errorValue.message
    if (errorValue?.title) return errorValue.title
    return "An unknown error occurred"
  }

  const getFieldValue = (field: string): string => {
    if (profile) {
      return (profile[field as keyof typeof profile] ||
        profile[field.toLowerCase() as keyof typeof profile])?.toString() || ""
    }
    return ""
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">My Profile</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 mb-2">{displayError(error)}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !profile && !error && (
          <div className="text-center p-8">
            <p className="text-gray-500 mb-4">No profile data available</p>
            <Button variant="outline" onClick={refetch}>
              Refresh
            </Button>
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={getFieldValue("Name")} readOnly />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={getFieldValue("Email")} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={getFieldValue("Phone")} readOnly />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" value={getFieldValue("Gender")} readOnly />
            </div>
            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" value={getFieldValue("Qualification")} readOnly />
            </div>
            <div>
              <Label htmlFor="experience">Experience Years</Label>
              <Input id="experience" value={getFieldValue("ExperienceYears")} readOnly />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
