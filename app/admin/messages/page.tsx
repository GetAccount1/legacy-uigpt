"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: string
  content: string
  role: string
  chatId: string
  timestamp: string
  userId?: string
}

interface Chat {
  id: string
  title: string
  date: string
  messages: any[]
  userId?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [editContent, setEditContent] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  useEffect(() => {
    // Load chats from localStorage
    const savedChats = JSON.parse(localStorage.getItem("operator_saved_chats") || "[]")
    setChats(savedChats)

    // Extract all messages from all chats
    const allMessages: Message[] = []
    savedChats.forEach((chat: Chat) => {
      if (chat.messages && Array.isArray(chat.messages)) {
        chat.messages.forEach((msg: any) => {
          allMessages.push({
            ...msg,
            chatId: chat.id,
            timestamp: msg.timestamp || new Date().toISOString(),
            userId: chat.userId,
          })
        })
      }
    })

    // Sort messages by timestamp (newest first)
    allMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    setMessages(allMessages)
  }, [])

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || message.role === filterRole
    return matchesSearch && matchesRole
  })

  const getChatTitle = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    return chat ? chat.title : "Unknown Chat"
  }

  const handleEditMessage = () => {
    if (!selectedMessage || !editContent) return

    // Update the message in the messages array
    const updatedMessages = messages.map((msg) => {
      if (msg.id === selectedMessage.id) {
        return { ...msg, content: editContent }
      }
      return msg
    })
    setMessages(updatedMessages)

    // Update the message in the chat
    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedMessage.chatId) {
        const updatedChatMessages = chat.messages.map((msg: any) => {
          if (msg.id === selectedMessage.id) {
            return { ...msg, content: editContent }
          }
          return msg
        })
        return { ...chat, messages: updatedChatMessages }
      }
      return chat
    })
    setChats(updatedChats)
    localStorage.setItem("operator_saved_chats", JSON.stringify(updatedChats))

    // Reset and close dialog
    setSelectedMessage(null)
    setEditContent("")
    setIsEditDialogOpen(false)
  }

  const handleDeleteMessage = () => {
    if (!selectedMessage) return

    // Remove the message from the messages array
    const updatedMessages = messages.filter((msg) => msg.id !== selectedMessage.id)
    setMessages(updatedMessages)

    // Remove the message from the chat
    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedMessage.chatId) {
        const updatedChatMessages = chat.messages.filter((msg: any) => msg.id !== selectedMessage.id)
        return { ...chat, messages: updatedChatMessages }
      }
      return chat
    })
    setChats(updatedChats)
    localStorage.setItem("operator_saved_chats", JSON.stringify(updatedChats))

    // Reset and close dialog
    setSelectedMessage(null)
    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (message: Message) => {
    setSelectedMessage(message)
    setEditContent(message.content)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (message: Message) => {
    setSelectedMessage(message)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="p-6">
      <AdminHeader title="Message Management" description="View and manage all messages across chats" />

      <div className="mt-6 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chat</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{getChatTitle(message.chatId)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      message.role === "user"
                        ? "bg-blue-100 text-blue-800"
                        : message.role === "assistant"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {message.role}
                  </span>
                </TableCell>
                <TableCell className="max-w-md truncate">{message.content}</TableCell>
                <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(message)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(message)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredMessages.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No messages found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Message Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
            <DialogDescription>Edit the content of this message</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[150px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditMessage}
              disabled={!editContent}
              className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Message Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMessage}>
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
