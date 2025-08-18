"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"
import type { MessageRecord } from "@/teacher/types"
import { STORAGE_KEYS, getArray, setArray, generateId } from "@/teacher/storage"

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([])
  const [receiverRole, setReceiverRole] = useState<string>("Admin")
  const [receiverId, setReceiverId] = useState<number>(1)
  const [context, setContext] = useState<string>("")
  const [text, setText] = useState<string>("")
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { setMessages(getArray<MessageRecord>(STORAGE_KEYS.messages)) }, [])

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }) }, [messages])

  const send = () => {
    if (!text.trim()) return
    const msg: MessageRecord = {
      MessageId: generateId("messages"),
      SenderId: 1001,
      SenderRole: "Teacher",
      ReceiverId: receiverId,
      ReceiverRole: receiverRole,
      MessageContext: context || null,
      Message1: text,
      SentAt: new Date().toISOString(),
    }
    const next = [...messages, msg]
    setMessages(next)
    setArray(STORAGE_KEYS.messages, next)
    setText("")
  }

  const filtered = useMemo(
    () =>
      messages.filter(
        (m) =>
          (m.ReceiverRole === receiverRole && m.ReceiverId === receiverId) ||
          (m.SenderRole === receiverRole && m.SenderId === receiverId)
      ),
    [messages, receiverRole, receiverId]
  )

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="h-8 w-8 mr-3 text-indigo-600" />
          Messages
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow">
          <CardHeader>
            <CardTitle className="text-gray-900">New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-gray-700">Receiver Role</Label>
              <Input
                className="bg-gray-100 border-gray-300 text-gray-900"
                value={receiverRole}
                onChange={(e) => setReceiverRole(e.target.value)}
                placeholder="Admin/Parent/Student"
              />
            </div>
            <div>
              <Label className="text-gray-700">Receiver Id</Label>
              <Input
                className="bg-gray-100 border-gray-300 text-gray-900"
                type="number"
                value={receiverId}
                onChange={(e) => setReceiverId(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-gray-700">Context</Label>
              <Input
                className="bg-gray-100 border-gray-300 text-gray-900"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., Attendance, Event"
              />
            </div>
            <div>
              <Label className="text-gray-700">Message</Label>
              <Input
                className="bg-gray-100 border-gray-300 text-gray-900"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message"
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={send}>
              Send
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white border-gray-200 shadow">
          <CardHeader>
            <CardTitle className="text-gray-900">Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={listRef}
              className="h-[480px] overflow-y-auto space-y-2 p-2 bg-gray-100 rounded"
            >
              {filtered.map((m) => (
                <div
                  key={m.MessageId}
                  className={`flex ${
                    m.SenderRole === "Teacher" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-2 rounded ${
                      m.SenderRole === "Teacher"
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="text-xs opacity-75">
                      {m.MessageContext ?? "General"} •{" "}
                      {new Date(m.SentAt || "").toLocaleString()}
                    </div>
                    <div>{m.Message1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
