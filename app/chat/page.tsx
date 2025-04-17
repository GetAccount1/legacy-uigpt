"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatGPTStyleUI } from "@/components/chatgpt-style-ui"

export default function ChatPage() {
  const router = useRouter()

  // Check if user is authenticated
  useEffect(() => {
    const user = localStorage.getItem("operator_user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  return (
    <main className="flex min-h-screen bg-[#f7f7f8]">
      <ChatGPTStyleUI />
    </main>
  )
}
