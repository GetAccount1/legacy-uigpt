"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Bot, Key, BarChart } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalBots: 0,
    totalApis: 0,
  })

  useEffect(() => {
    // Calculate stats from localStorage
    const users = JSON.parse(localStorage.getItem("operator_users") || "[]")
    const chats = JSON.parse(localStorage.getItem("operator_saved_chats") || "[]")

    // Count total messages across all chats
    let messageCount = 0
    chats.forEach((chat: any) => {
      messageCount += chat.messages?.length || 0
    })

    // For demo purposes, we'll use placeholder values for bots and APIs
    setStats({
      totalUsers: users.length,
      totalMessages: messageCount,
      totalBots: 3, // Placeholder
      totalApis: 2, // Placeholder
    })
  }, [])

  return (
    <div className="p-6">
      <AdminHeader title="Dashboard" description="Overview of your Operator.dev system" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Messages exchanged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBots}</div>
            <p className="text-xs text-muted-foreground">Configured bots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApis}</div>
            <p className="text-xs text-muted-foreground">Active API integrations</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Message volume over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center text-muted-foreground">
              <BarChart className="h-16 w-16 mb-4 opacity-50" />
              <p>Analytics data will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
