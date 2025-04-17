"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email?: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("operator_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Check for admin credentials
    if (username === "thanhphomgdep@gmail.com" && password === "@ThinkEveryting123") {
      const adminUser = {
        id: "admin-1",
        username: "thanhphomgdep@gmail.com",
        role: "admin" as const,
      }
      localStorage.setItem("operator_user", JSON.stringify(adminUser))
      setUser(adminUser)
      setIsLoading(false)
      return true
    }

    // Check for regular users
    const users = JSON.parse(localStorage.getItem("operator_users") || "[]")
    const foundUser = users.find(
      (u: any) => (u.username === username || u.email === username) && u.password === password,
    )

    if (foundUser) {
      const userInfo = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role || "user",
      }
      localStorage.setItem("operator_user", JSON.stringify(userInfo))
      setUser(userInfo as User)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    localStorage.removeItem("operator_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
