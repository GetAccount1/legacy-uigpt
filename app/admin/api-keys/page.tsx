"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Copy, Eye, EyeOff } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface ApiKey {
  id: string
  name: string
  key: string
  provider: string
  createdAt: string
  lastUsed?: string
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  // Form states
  const [name, setName] = useState("")
  const [key, setKey] = useState("")
  const [provider, setProvider] = useState("yescale")

  useEffect(() => {
    // Load API keys from localStorage
    const storedApiKeys = JSON.parse(localStorage.getItem("operator_api_keys") || "[]")

    // If no API keys exist, create a default one if there's a global API key
    if (storedApiKeys.length === 0) {
      const globalApiKey = localStorage.getItem("operator_api_key")
      const globalApiUrl = localStorage.getItem("operator_api_url") || ""

      if (globalApiKey) {
        const provider = globalApiUrl.includes("yescale") ? "yescale" : "other"
        const defaultApiKey = {
          id: "api-1",
          name: `Default ${provider.charAt(0).toUpperCase() + provider.slice(1)} API Key`,
          key: globalApiKey,
          provider,
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
        }
        localStorage.setItem("operator_api_keys", JSON.stringify([defaultApiKey]))
        setApiKeys([defaultApiKey])
      }
    } else {
      setApiKeys(storedApiKeys)
    }
  }, [])

  const handleAddApiKey = () => {
    // Validate form
    if (!name || !key || !provider) return

    const newApiKey = {
      id: `api-${Date.now()}`,
      name,
      key,
      provider,
      createdAt: new Date().toISOString(),
    }

    const updatedApiKeys = [...apiKeys, newApiKey]
    setApiKeys(updatedApiKeys)
    localStorage.setItem("operator_api_keys", JSON.stringify(updatedApiKeys))

    // Reset form and close dialog
    setName("")
    setKey("")
    setProvider("yescale")
    setIsAddDialogOpen(false)
  }

  const handleDeleteApiKey = () => {
    if (!selectedApiKey) return

    const updatedApiKeys = apiKeys.filter((apiKey) => apiKey.id !== selectedApiKey.id)
    setApiKeys(updatedApiKeys)
    localStorage.setItem("operator_api_keys", JSON.stringify(updatedApiKeys))

    setSelectedApiKey(null)
    setIsDeleteDialogOpen(false)
  }

  const openDeleteDialog = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey)
    setIsDeleteDialogOpen(true)
  }

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "API Key copied",
      description: "The API key has been copied to your clipboard.",
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    })
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••"
    return key.substring(0, 4) + "••••••••" + key.substring(key.length - 4)
  }

  return (
    <div className="p-6">
      <AdminHeader
        title="API Key Management"
        description="Manage API keys for different providers"
        action={{
          label: "Add API Key",
          onClick: () => {
            setName("")
            setKey("")
            setProvider("yescale")
            setIsAddDialogOpen(true)
          },
        }}
      />

      <div className="mt-6 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {visibleKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="h-6 w-6"
                    >
                      {visibleKeys[apiKey.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiKey.key)} className="h-6 w-6">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      apiKey.provider === "yescale" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {apiKey.provider}
                  </span>
                </TableCell>
                <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(apiKey)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {apiKeys.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No API keys found. Add your first API key to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add API Key Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New API Key</DialogTitle>
            <DialogDescription>Add a new API key for integration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this API key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key">API Key</Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter the API key"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yescale">YeScale</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddApiKey}
              disabled={!name || !key || !provider}
              className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete API Key Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteApiKey}>
              Delete API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
