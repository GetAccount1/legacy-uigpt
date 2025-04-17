"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("operator_user")
    if (user) {
      router.push("/chat")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password")
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    setTimeout(() => {
      // Check for admin credentials
      if (username === "thanhphomgdep@gmail.com" && password === "@ThinkEveryting123") {
        const user = {
          id: "admin-1",
          username: "thanhphomgdep@gmail.com",
          role: "admin",
        }
        localStorage.setItem("operator_user", JSON.stringify(user))
        router.push("/admin/dashboard")
        return
      }

      // Check for regular users (stored in localStorage)
      const users = JSON.parse(localStorage.getItem("operator_users") || "[]")
      const user = users.find((u: any) => (u.username === username || u.email === username) && u.password === password)

      if (user) {
        // Store user info in localStorage (excluding password)
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: "user",
        }
        localStorage.setItem("operator_user", JSON.stringify(userInfo))
        router.push("/chat")
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#10a37f] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to Operator.dev</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-[#10a37f] hover:text-[#0e8f6e]">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-[#10a37f] hover:text-[#0e8f6e]">
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#10a37f] hover:bg-[#0e8f6e] text-white" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
