"use client"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApiKeyDialogProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
  apiUrl: string
  onSave: (apiKey: string, apiUrl: string) => void
}

export function ApiKeyDialog({ isOpen, onClose, apiKey, apiUrl, onSave }: ApiKeyDialogProps) {
  const [key, setKey] = useState(apiKey)
  const [url, setUrl] = useState(apiUrl || "https://api.yescale.io/v1")
  const [isKeyVisible, setIsKeyVisible] = useState(false)

  useEffect(() => {
    setKey(apiKey)
    setUrl(apiUrl || "https://api.yescale.io/v1")
  }, [apiKey, apiUrl, isOpen])

  const handleSave = () => {
    onSave(key, url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>Configure your API key and endpoint URL to connect with YeScale API.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex">
              <Input
                id="api-key"
                type={isKeyVisible ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your API key"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={() => setIsKeyVisible(!isKeyVisible)} className="ml-2">
                {isKeyVisible ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Your API key is stored locally and never sent to our servers.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.yescale.io/v1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!key.trim()} className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
