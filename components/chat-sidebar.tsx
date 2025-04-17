"use client"
import { useState, useEffect } from "react"
import { Plus, MessageSquare, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onChatSelect: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onNewChat: () => void
  currentChatId: string | null
}

interface SavedChat {
  id: string
  title: string
  date: string
  messages: any[]
}

export function ChatSidebar({
  isOpen,
  onClose,
  onChatSelect,
  onDeleteChat,
  onNewChat,
  currentChatId,
}: ChatSidebarProps) {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([])

  // Load saved chats from localStorage on component mount
  useEffect(() => {
    const storedChats = localStorage.getItem("operator_saved_chats")
    if (storedChats) {
      setSavedChats(JSON.parse(storedChats))
    }
  }, [])

  // Update saved chats when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedChats = localStorage.getItem("operator_saved_chats")
      if (storedChats) {
        setSavedChats(JSON.parse(storedChats))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative top-0 bottom-0 left-0 z-50
        w-[260px] bg-[#202123] text-white flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={onNewChat}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-3 right-3 md:hidden text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {savedChats.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs text-gray-500 uppercase">Recent chats</div>
              <div className="space-y-1 px-2">
                {savedChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/10 cursor-pointer group ${
                      currentChatId === chat.id ? "bg-white/10" : ""
                    }`}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="text-sm truncate">{chat.title}</div>
                      <div className="text-xs text-gray-500">{chat.date}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center text-gray-500">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No saved chats yet</p>
              <p className="text-xs mt-1">Start a new conversation to see it here</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Operator.dev</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </>
  )
}
