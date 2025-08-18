"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import useEvents from "@/teacher/hooks/useEvents"
import type { EventRecord } from "@/teacher/types"

const EVENT_TYPES = [
  "Other",
  "Holiday", 
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar"
]

export default function EventsPage() {
  const { events, isLoading, error, create, update, remove, refetch } = useEvents()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    EventDate: "",
    StartTime: "",
    EndTime: "",
    Venue: "",
    EventType: "",
  })

  const resetForm = () => {
    setForm({
      Title: "",
      Description: "",
      EventDate: "",
      StartTime: "",
      EndTime: "",
      Venue: "",
      EventType: "",
    })
    setEditingEvent(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (event: EventRecord) => {
    // Format dates and times properly for form inputs
    const formatDate = (dateStr: string | null | undefined) => {
      if (!dateStr) return ""
      try {
        // Handle different date formats
        const date = new Date(dateStr)
        return date.toISOString().split('T')[0] // YYYY-MM-DD format
      } catch {
        return dateStr
      }
    }

    const formatTime = (timeStr: string | null | undefined) => {
      if (!timeStr) return ""
      // If it's already in HH:MM format, return as is
      if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr
      // If it's a full time string, extract HH:MM
      try {
        const date = new Date(`1970-01-01T${timeStr}`)
        return date.toTimeString().slice(0, 5)
      } catch {
        return timeStr
      }
    }

    setForm({
      Title: event.Title || "",
      Description: event.Description || "",
      EventDate: formatDate(event.EventDate),
      StartTime: formatTime(event.StartTime),
      EndTime: formatTime(event.EndTime),
      Venue: event.Venue || "",
      EventType: event.EventType || "",
    })
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingEvent) {
        await update(editingEvent.EventId, { ...form, EventId: editingEvent.EventId })
        toast("Success", "Event updated successfully!")
      } else {
        await create(form)
        toast("Success", "Event created successfully!")
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err: any) {
      toast("Error", err.message || "Failed to save event", { variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      await remove(eventId)
      toast("Success", "Event deleted successfully!")
    } catch (err: any) {
      toast("Error", err.message || "Failed to delete event", { variant: "destructive" })
    }
  }

  // Format display values
  const formatDisplayDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A"
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  const formatDisplayTime = (startTime: string | null | undefined, endTime: string | null | undefined) => {
    if (!startTime && !endTime) return "N/A"
    if (startTime && endTime) return `${startTime} - ${endTime}`
    return startTime || endTime || "N/A"
  }

  const visibleEvents = useMemo(() => {
    const start = (page - 1) * pageSize
    return events.slice(start, start + pageSize)
  }, [events, page])
  const totalPages = Math.max(1, Math.ceil(events.length / pageSize))
  useEffect(() => { setPage(1) }, [events.length])

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Events Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Create and manage your events</p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateModal}>Create Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <Label htmlFor="title">Title</Label>
    <Input
      id="title"
      value={form.Title}
      onChange={(e) => setForm({ ...form, Title: e.target.value })}
      required
      className="bg-white"
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="eventDate">Event Date</Label>
      <Input
        id="eventDate"
        type="date"
        value={form.EventDate}
        onChange={(e) => setForm({ ...form, EventDate: e.target.value })}
        required
        className="bg-white"
      />
    </div>
    <div>
      <Label htmlFor="eventType">Event Type</Label>
      <Select
        value={form.EventType}
        onValueChange={(value) => setForm({ ...form, EventType: value })}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select event type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {EVENT_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="startTime">Start Time</Label>
      <Input
        id="startTime"
        type="time"
        value={form.StartTime}
        onChange={(e) => setForm({ ...form, StartTime: e.target.value })}
        className="bg-white"
      />
    </div>
    <div>
      <Label htmlFor="endTime">End Time</Label>
      <Input
        id="endTime"
        type="time"
        value={form.EndTime}
        onChange={(e) => setForm({ ...form, EndTime: e.target.value })}
        className="bg-white"
      />
    </div>
  </div>

  <div>
    <Label htmlFor="venue">Venue</Label>
    <Input
      id="venue"
      value={form.Venue}
      onChange={(e) => setForm({ ...form, Venue: e.target.value })}
      placeholder="Classroom, Auditorium, etc."
      className="bg-white"
    />
  </div>

  <div>
    <Label htmlFor="description">Description</Label>
    <Textarea
      id="description"
      value={form.Description}
      onChange={(e) => setForm({ ...form, Description: e.target.value })}
      rows={3}
      className="bg-white"
    />
  </div>

  <div className="flex justify-end gap-2">
    <Button
      type="button"
      variant="outline"
      onClick={() => setIsModalOpen(false)}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : editingEvent ? "Update" : "Create"}
    </Button>
  </div>
</form>

              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-600 mb-2">{error}</p>
              <Button variant="outline" size="sm" onClick={refetch}>
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && (
          <>
          <div className="rounded-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No events found. Create your first event!
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleEvents.map((event) => (
                    <TableRow key={event.EventId}>
                      <TableCell className="font-medium">{event.Title || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">{event.Description || "N/A"}</TableCell>
                      <TableCell>{formatDisplayDate(event.EventDate)}</TableCell>
                      <TableCell>
                        {formatDisplayTime(event.StartTime, event.EndTime)}
                      </TableCell>
                      <TableCell>{event.Venue || "N/A"}</TableCell>
                      <TableCell>{event.EventType || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(event)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(event.EventId)}
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="space-x-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
          </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
