"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Plus, Menu, RefreshCw, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BrowserMockup } from "@/components/browser-mockup"
import { ModelSelector } from "@/components/model-selector"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ApiKeyDialog } from "@/components/api-key-dialog"
import { CodeRenderer } from "@/components/code-renderer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"

interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  showPreview?: boolean
  codeBlocks?: {
    html?: string
    css?: string
    js?: string
  }
}

export function ChatGPTStyleUI() {
  const [bottomInput, setBottomInput] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()

  // Check for API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("operator_api_key")
    const storedApiUrl = localStorage.getItem("operator_api_url") || "https://api.yescale.io/v1"

    if (storedApiKey) {
      setApiKey(storedApiKey)
    } else {
      setIsApiKeyDialogOpen(true)
    }

    if (storedApiUrl) {
      setApiUrl(storedApiUrl)
    }

    // Create a new chat if none exists
    const chatId = localStorage.getItem("operator_current_chat_id")
    if (chatId) {
      setCurrentChatId(chatId)
      loadChatMessages(chatId)
    } else {
      createNewChat()
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const saveApiSettings = (key: string, url: string) => {
    setApiKey(key)
    setApiUrl(url)
    localStorage.setItem("operator_api_key", key)
    localStorage.setItem("operator_api_url", url)
    setIsApiKeyDialogOpen(false)
  }

  const createNewChat = () => {
    const newChatId = Date.now().toString()
    setCurrentChatId(newChatId)
    setMessages([])
    localStorage.setItem("operator_current_chat_id", newChatId)

    // Save the new chat to the list of chats
    const savedChats = JSON.parse(localStorage.getItem("operator_saved_chats") || "[]")
    const newChat = {
      id: newChatId,
      title: "New chat",
      date: new Date().toISOString().split("T")[0],
      messages: [],
      userId: user?.id, // Associate chat with current user
    }

    const updatedChats = [newChat, ...savedChats]
    localStorage.setItem("operator_saved_chats", JSON.stringify(updatedChats))

    return newChatId
  }

  const loadChatMessages = (chatId: string) => {
    const savedChats = JSON.parse(localStorage.getItem("operator_saved_chats") || "[]")
    const chat = savedChats.find((c: any) => c.id === chatId)

    if (chat && chat.messages) {
      setMessages(chat.messages)
    } else {
      setMessages([])
    }
  }

  const saveChatMessages = (chatId: string, updatedMessages: Message[]) => {
    const savedChats = JSON.parse(localStorage.getItem("operator_saved_chats") || "[]")
    const chatIndex = savedChats.findIndex((c: any) => c.id === chatId)

    if (chatIndex !== -1) {
      // Update the chat title based on the first user message if it exists
      const firstUserMessage = updatedMessages.find((m) => m.role === "user")
      if (firstUserMessage && savedChats[chatIndex].title === "New chat") {
        savedChats[chatIndex].title =
          firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
      }

      savedChats[chatIndex].messages = updatedMessages
      localStorage.setItem("operator_saved_chats", JSON.stringify(savedChats))
    }
  }

  const handleSendMessage = async () => {
    if (!bottomInput.trim() || !apiKey || !currentChatId) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: bottomInput,
      role: "user",
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveChatMessages(currentChatId, updatedMessages)
    setBottomInput("")
    setIsLoading(true)

    try {
      // Check if the message contains code-related keywords
      const isCodeRequest = /html|css|javascript|code|render|preview/i.test(bottomInput)

      // Simulate API call (replace with actual API call)
      const response = await new Promise<Message>((resolve) => {
        setTimeout(() => {
          if (isCodeRequest) {
            resolve({
              id: (Date.now() + 1).toString(),
              content:
                "I've created a simple HTML, CSS, and JavaScript example based on your request. You can view and edit the code below:",
              role: "assistant",
              codeBlocks: {
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Page</title>
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>This is a simple example page.</p>
    <button id="changeColorBtn">Change Color</button>
  </div>
</body>
</html>`,
                css: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #0066cc;
}

button {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0052a3;
}`,
                js: `document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('changeColorBtn');
  const heading = document.querySelector('h1');
  
  button.addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    heading.style.color = randomColor;
  });
});`,
              },
            })
          } else {
            resolve({
              id: (Date.now() + 1).toString(),
              content: "I'm displaying a preview of the requested URL.",
              role: "assistant",
              showPreview: true,
            })
          }
        }, 1500)
      })

      const finalMessages = [...updatedMessages, response]
      setMessages(finalMessages)
      saveChatMessages(currentChatId, finalMessages)
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        role: "system",
      }

      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)
      saveChatMessages(currentChatId, finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId)
    localStorage.setItem("operator_current_chat_id", chatId)
    loadChatMessages(chatId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleDeleteChat = (chatId: string) => {
    const savedChats = JSON.parse(localStorage.getItem("operator_saved_chats") || "[]")
    const updatedChats = savedChats.filter((c: any) => c.id !== chatId)
    localStorage.setItem("operator_saved_chats", JSON.stringify(updatedChats))

    // If the current chat is deleted, create a new one
    if (currentChatId === chatId) {
      createNewChat()
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex w-full h-screen font-sans">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        onNewChat={createNewChat}
        currentChatId={currentChatId}
      />

      {/* Main Content */}
      <div className="flex flex-col w-full h-screen">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-200 bg-white py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <ModelSelector value={selectedModel} onValueChange={setSelectedModel} apiUrl={apiUrl} apiKey={apiKey} />
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/dashboard")} className="text-xs">
                Admin Dashboard
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={createNewChat} className="text-xs flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsApiKeyDialogOpen(true)} className="text-xs">
              API Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-auto bg-[#f7f7f8]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-16 h-16 rounded-full bg-[#10a37f] flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">O</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">Operator.dev</h2>
              <p className="text-sm max-w-md text-center">Send a message to start browsing the web with Operator.dev</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`w-full py-6 px-4 md:px-8 ${message.role === "user" ? "bg-white" : "bg-[#f7f7f8]"} border-b border-gray-100`}
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-4">
                      <div
                        className={`w-7 h-7 rounded-full ${
                          message.role === "user"
                            ? "bg-gray-300"
                            : message.role === "assistant"
                              ? "bg-[#10a37f]"
                              : "bg-orange-500"
                        } flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {message.role === "user" ? "U" : message.role === "assistant" ? "A" : "S"}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 mb-4">{message.content}</p>

                        {message.showPreview && (
                          <div className="mt-4 mb-6">
                            <BrowserMockup />
                          </div>
                        )}

                        {message.codeBlocks && (
                          <div className="mt-4 mb-6 border border-gray-200 rounded-md overflow-hidden">
                            <Tabs defaultValue="preview" className="w-full">
                              <div className="bg-gray-100 border-b border-gray-200">
                                <TabsList className="bg-transparent border-b-0 p-0">
                                  <TabsTrigger
                                    value="preview"
                                    className="data-[state=active]:bg-white rounded-none border-r border-gray-200"
                                  >
                                    Preview
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="html"
                                    className="data-[state=active]:bg-white rounded-none border-r border-gray-200"
                                  >
                                    HTML
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="css"
                                    className="data-[state=active]:bg-white rounded-none border-r border-gray-200"
                                  >
                                    CSS
                                  </TabsTrigger>
                                  <TabsTrigger value="js" className="data-[state=active]:bg-white rounded-none">
                                    JavaScript
                                  </TabsTrigger>
                                </TabsList>
                              </div>

                              <TabsContent value="preview" className="mt-0 p-0">
                                <CodeRenderer
                                  html={message.codeBlocks.html || ""}
                                  css={message.codeBlocks.css || ""}
                                  js={message.codeBlocks.js || ""}
                                />
                              </TabsContent>

                              <TabsContent value="html" className="mt-0 p-0">
                                <div className="bg-gray-50 p-4">
                                  <Textarea
                                    value={message.codeBlocks.html || ""}
                                    className="font-mono text-sm h-[300px] bg-white"
                                    readOnly
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="css" className="mt-0 p-0">
                                <div className="bg-gray-50 p-4">
                                  <Textarea
                                    value={message.codeBlocks.css || ""}
                                    className="font-mono text-sm h-[300px] bg-white"
                                    readOnly
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="js" className="mt-0 p-0">
                                <div className="bg-gray-50 p-4">
                                  <Textarea
                                    value={message.codeBlocks.js || ""}
                                    className="font-mono text-sm h-[300px] bg-white"
                                    readOnly
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="w-full py-6 px-4 md:px-8 bg-[#f7f7f8] border-b border-gray-100">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-[#10a37f] flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-2 rounded-md text-gray-500 hover:text-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Input
                  value={bottomInput}
                  onChange={(e) => setBottomInput(e.target.value)}
                  placeholder="Message Operator.dev..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isLoading || !apiKey}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSendMessage}
                  className={`h-8 w-8 mr-2 rounded-md ${
                    bottomInput.trim() && !isLoading && apiKey ? "text-[#10a37f] hover:text-[#0e8f6e]" : "text-gray-300"
                  }`}
                  disabled={!bottomInput.trim() || isLoading || !apiKey}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {!apiKey
                ? "Please set your API key in API Settings to start chatting."
                : "Operator.dev actions can sometimes be incorrect. Please review operations to avoid unwanted situations."}
            </p>
          </div>
        </div>
      </div>

      {/* API Key Dialog */}
      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onClose={() => {
          if (apiKey) setIsApiKeyDialogOpen(false)
        }}
        apiKey={apiKey}
        apiUrl={apiUrl}
        onSave={saveApiSettings}
      />
    </div>
  )
}
