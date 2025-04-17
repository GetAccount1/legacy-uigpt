"use client"
import { useState, useEffect } from "react"
import { ChevronDown, Plus, X, Settings, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  apiUrl: string
  apiKey: string
}

interface Model {
  id: string
  name: string
  description?: string
}

export function ModelSelector({ value, onValueChange, apiUrl, apiKey }: ModelSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [models, setModels] = useState<Model[]>([])
  const [customModels, setCustomModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newModelId, setNewModelId] = useState("")
  const [newModelName, setNewModelName] = useState("")
  const [newModelDescription, setNewModelDescription] = useState("")

  // Load custom models from localStorage on component mount
  useEffect(() => {
    const storedModels = localStorage.getItem("operator_custom_models")
    if (storedModels) {
      setCustomModels(JSON.parse(storedModels))
    }
  }, [])

  // Fetch models from API when apiKey or apiUrl changes
  useEffect(() => {
    if (apiKey && apiUrl) {
      fetchModels()
    }
  }, [apiKey, apiUrl])

  // Set default model when models are loaded
  useEffect(() => {
    const allModels = [...models, ...customModels]
    if (allModels.length > 0 && !value) {
      onValueChange(allModels[0].id)
    }
  }, [models, customModels, value, onValueChange])

  // Save custom models to localStorage when they change
  useEffect(() => {
    localStorage.setItem("operator_custom_models", JSON.stringify(customModels))
  }, [customModels])

  const fetchModels = async () => {
    if (!apiKey || !apiUrl) return

    setIsLoading(true)
    setError(null)

    try {
      // In a real application, you would make an actual API call
      // For this example, we'll simulate an API response

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate API response for YeScale models
      const apiModels: Model[] = [
        {
          id: "yescale/llama-3-8b-instruct",
          name: "Llama 3 8B Instruct",
          description: "Meta's Llama 3 8B Instruct model",
        },
        {
          id: "yescale/llama-3-70b-instruct",
          name: "Llama 3 70B Instruct",
          description: "Meta's Llama 3 70B Instruct model",
        },
        {
          id: "yescale/mistral-7b-instruct",
          name: "Mistral 7B Instruct",
          description: "Mistral AI's 7B Instruct model",
        },
        {
          id: "yescale/mixtral-8x7b-instruct",
          name: "Mixtral 8x7B Instruct",
          description: "Mistral AI's Mixtral 8x7B Instruct model",
        },
      ]

      setModels(apiModels)

      // If no model is selected yet, select the first one
      if (!value && apiModels.length > 0) {
        onValueChange(apiModels[0].id)
      }
    } catch (err) {
      console.error("Error fetching models:", err)
      setError("Failed to fetch models. Please check your API key and URL.")
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomModel = () => {
    if (!newModelId || !newModelName) return

    const newModel = {
      id: newModelId,
      name: newModelName,
      description: newModelDescription || "Custom model",
    }

    setCustomModels([...customModels, newModel])
    setNewModelId("")
    setNewModelName("")
    setNewModelDescription("")
  }

  const removeCustomModel = (modelId: string) => {
    const updatedModels = customModels.filter((model) => model.id !== modelId)
    setCustomModels(updatedModels)

    // If the currently selected model is removed, select the first available model
    if (value === modelId) {
      const allRemainingModels = [...models, ...updatedModels]
      if (allRemainingModels.length > 0) {
        onValueChange(allRemainingModels[0].id)
      } else {
        onValueChange("")
      }
    }
  }

  const allModels = [...models, ...customModels]

  return (
    <div className="flex items-center">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className="w-[180px] h-9 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          disabled={isLoading || allModels.length === 0}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : allModels.length === 0 ? (
            <span className="text-gray-500">No models available</span>
          ) : (
            <SelectValue placeholder="Select a model" />
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <div className="flex items-center justify-between px-3 py-1">
              <SelectLabel className="text-xs text-gray-500 font-normal">Models</SelectLabel>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={fetchModels}
                  disabled={isLoading || !apiKey}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setIsDialogOpen(true)
                    // This prevents the select from closing
                    setTimeout(() => document.body.click(), 0)
                  }}
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2">
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {models.length > 0 && (
              <>
                <SelectLabel className="px-3 py-1 text-xs text-gray-500 font-normal">YeScale Models</SelectLabel>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="py-2.5 px-3 text-sm cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}

            {customModels.length > 0 && (
              <>
                <SelectLabel className="px-3 py-1 text-xs text-gray-500 font-normal mt-2">Custom Models</SelectLabel>
                {customModels.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="py-2.5 px-3 text-sm cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Models</DialogTitle>
            <DialogDescription>Add custom models or refresh the model list from YeScale API.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <Button
              onClick={fetchModels}
              disabled={isLoading || !apiKey}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Models from API
            </Button>

            {customModels.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Custom Models</Label>
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {customModels.map((model) => (
                    <div
                      key={model.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-sm">{model.name}</p>
                        <p className="text-xs text-gray-500">{model.id}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-500"
                        onClick={() => removeCustomModel(model.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <Label htmlFor="model-id">Model ID</Label>
              <Input
                id="model-id"
                value={newModelId}
                onChange={(e) => setNewModelId(e.target.value)}
                placeholder="e.g., yescale/custom-model"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-name">Display Name</Label>
              <Input
                id="model-name"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="e.g., Custom Model"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-description">Description (optional)</Label>
              <Input
                id="model-description"
                value={newModelDescription}
                onChange={(e) => setNewModelDescription(e.target.value)}
                placeholder="Brief description of the model"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={addCustomModel}
              disabled={!newModelId || !newModelName}
              className="bg-[#10a37f] hover:bg-[#0e8f6e] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
