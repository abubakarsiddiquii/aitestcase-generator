"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Post {
  id: string
  content: string
  authorId: string
  authorName: string
  authorEmail: string
  createdAt: string
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const userInitials =
    post.authorName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.authorId}`}>
            <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
              <AvatarFallback className="bg-blue-600 text-white">{userInitials}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${post.authorId}`} className="font-medium hover:text-blue-600 transition-colors">
              {post.authorName}
            </Link>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  )
}
