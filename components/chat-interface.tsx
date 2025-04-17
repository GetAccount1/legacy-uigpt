"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { ChatHeader } from "./chat-header"
import { ChatMessage } from "./chat-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  status?: "executing" | "complete" | "denied"
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to Operator.dev. I'm ready to execute your commands.",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      // Add system message
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Executing command...",
        role: "system",
        status: "executing",
      }
      setMessages((prev) => [...prev, systemMessage])

      // Simulate AI response after a delay
      setTimeout(() => {
        setIsTyping(false)

        // Update system message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === systemMessage.id
              ? { ...msg, content: "Command executed successfully.", status: "complete" }
              : msg,
          ),
        )

        // Add AI response
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          content: getAIResponse(input),
          role: "assistant",
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 2000)
    }, 1000)
  }

  const getAIResponse = (userInput: string): string => {
    // Simple response logic based on user input
    const input = userInput.toLowerCase()

    if (input.includes("open") && input.includes("browser")) {
      return "Browser window opened. You now have access to web browsing capabilities."
    } else if (input.includes("screenshot")) {
      return "Screenshot captured and saved to your desktop."
    } else if (input.includes("file") && (input.includes("find") || input.includes("search"))) {
      return "I've located the files matching your criteria. Would you like me to display them?"
    } else if (input.includes("terminal") || input.includes("command")) {
      return "Terminal command executed. Output: Operation completed successfully."
    } else {
      return "I've processed your request. Is there anything specific you'd like me to explain about the results?"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white border border-zinc-800 rounded-lg overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-zinc-400 pl-4">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span className="text-sm">Operator is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your command..."
            className="flex-1 bg-zinc-900 border-zinc-700 focus-visible:ring-emerald-500 text-white placeholder:text-zinc-500"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-emerald-600 hover:bg-emerald-500 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
