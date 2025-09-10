"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  bio?: string
  createdAt: string
}

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-20 w-20 bg-gray-300 rounded-full"></div>
            <div className="space-y-2 text-center">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">User not found</p>
        </CardContent>
      </Card>
    )
  }

  const userInitials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-blue-600 text-white text-2xl">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {user.bio && (
          <div className="space-y-2">
            <h3 className="font-medium">About</h3>
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Joined {joinDate}</span>
        </div>

        <Badge variant="secondary" className="w-fit">
          Community Member
        </Badge>
      </CardContent>
    </Card>
  )
}
