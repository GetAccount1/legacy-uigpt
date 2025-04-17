"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface BotConfig {
  id: string
  name: string
  description: string
  model: string
  systemPrompt: string
  isActive: boolean
  createdAt: string
}

export default function BotsPage() {
  const [bots, setBots] = useState<BotConfig[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBot, setSelectedBot] = useState<BotConfig | null>(null)

  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [model, setModel] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Load bots from localStorage
    const storedBots = JSON.parse(localStorage.getItem("operator_bots") || "[]")

    // If no bots exist, create some default ones
    if (storedBots.length === 0) {
      const defaultBots = [
        {
          id: "bot-1",
          name: "Web Browser",
          description: "A bot that can browse the web and extract information",
          model: "yescale/llama-3-70b-instruct",
          systemPrompt:
            "You are a helpful web browsing assistant. You can navigate websites and extract information for the user.",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "bot-2",
          name: "Code Assistant",
          description: "A bot specialized in writing and explaining code",
          model: "yescale/llama-3-70b-instruct",
          systemPrompt:
            "You are a coding assistant. Help users write, debug, and understand code in various programming languages.",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "bot-3",
          name: "Research Helper",
          description: "A bot that helps with research and summarization",
          model: "yescale/mixtral-8x7b-instruct",
          systemPrompt:
            "You are a research assistant. Help users find information, summarize content, and organize research materials.",
          isActive: false,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem("operator_bots", JSON.stringify(defaultBots))
      setBots(defaultBots)
    } else {
      setBots(storedBots)
    }
  }, [])

  const handleAddBot = () => {
    // Validate form
    if (!name || !model || !systemPrompt) return

    const newBot = {
      id: `bot-${Date.now()}`,
      name,
      description,
      model,
      systemPrompt,
      isActive,
      createdAt: new Date().toISOString(),
    }

    const updatedBots = [...bots, newBot]
    setBots(updatedBots)
    localStorage.setItem("operator_bots", JSON.stringify(updatedBots))

    // Reset form and close dialog
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditBot = () => {
    if (!selectedBot || !name || !model || !systemPrompt) return

    const updatedBots = bots.map((bot) => {
      if (bot.id === selectedBot.id) {
        return {
          ...bot,
          name,
          description,
          model,
          systemPrompt,
          isActive,
        }
      }
      return bot
    })

    setBots(updatedBots)
    localStorage.setItem("operator_bots", JSON.stringify(updatedBots))

    // Reset form and close dialog
    resetForm()
    setIsEditDialogOpen(false)
  }

  const handleDeleteBot = () => {
    if (!selectedBot) return

    const updatedBots = bots.filter((bot) => bot.id !== selectedBot.id)
    setBots(updatedBots)
    localStorage.setItem("operator_bots", JSON.stringify(updatedBots))

    setSelectedBot(null)
    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (bot: BotConfig) => {
    setSelectedBot(bot)
    setName(bot.name)
    setDescription(bot.description)
    setModel(bot.model)
    setSystemPrompt(bot.systemPrompt)
    setIsActive(bot.isActive)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (bot: BotConfig) => {
    setSelectedBot(bot)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setModel("")
    setSystemPrompt("")
    setIsActive(true)
    setSelectedBot(null)
  }

  return (
    <div className="p-6">
      <AdminHeader
        title="Bot Management"
        description="Create and manage AI bots"
        action={{
          label: "Add Bot",
          onClick: () => {
            resetForm()
            setIsAddDialogOpen(true)
          },
        }}
      />

      <div className="mt-6 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="font-medium">{bot.name}</TableCell>
                <TableCell className="max-w-xs truncate">{bot.description}</TableCell>
                <TableCell>{bot.model.split("/").pop()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      bot.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {bot.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>{new Date(bot.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(bot)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(bot)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {bots.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No bots found. Add your first bot to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Bot Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bot</DialogTitle>
            <DialogDescription>Create a new AI bot configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter bot name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter bot description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., yescale/llama-3-70b-instruct"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter system prompt for the bot"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBot}
              disabled={!name || !model || !systemPrompt}
              className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bot</DialogTitle>
            <DialogDescription>Update bot configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Bot Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model</Label>
              <Input id="edit-model" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-systemPrompt">System Prompt</Label>
              <Textarea
                id="edit-systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditBot}
              disabled={!name || !model || !systemPrompt}
              className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bot Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBot}>
              Delete Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
