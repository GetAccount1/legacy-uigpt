"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalChats: 0,
    activeUsers: 0,
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

    // For demo purposes, we'll use placeholder values for active users
    setStats({
      totalUsers: users.length,
      totalMessages: messageCount,
      totalChats: chats.length,
      activeUsers: Math.min(users.length, 3), // Placeholder
    })
  }, [])

  return (
    <div className="p-6">
      <AdminHeader title="Analytics" description="View usage statistics and analytics" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Users active in the last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChats}</div>
            <p className="text-xs text-muted-foreground">Conversations created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Messages exchanged</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="usage">
          <TabsList>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Usage Trends
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Model Usage
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              User Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Message volume over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mb-4 opacity-50" />
                  <p>Usage analytics data will appear here</p>
                  <p className="text-sm mt-2">This is a placeholder for the usage trends chart</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage</CardTitle>
                <CardDescription>Distribution of requests by model</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mb-4 opacity-50" />
                  <p>Model usage analytics data will appear here</p>
                  <p className="text-sm mt-2">This is a placeholder for the model usage chart</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Active users and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center text-muted-foreground">
                  <PieChart className="h-16 w-16 mb-4 opacity-50" />
                  <p>User activity analytics data will appear here</p>
                  <p className="text-sm mt-2">This is a placeholder for the user activity chart</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
