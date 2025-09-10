import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { posts, users } from "@/lib/data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  let filteredPosts = posts

  if (userId) {
    filteredPosts = posts.filter((post) => post.authorId === userId)
  }

  // Sort by creation date (newest first)
  const sortedPosts = filteredPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((post) => {
      const author = users.find((user) => user.id === post.authorId)
      return {
        ...post,
        authorName: author?.name || "Unknown User",
        authorEmail: author?.email || "",
      }
    })

  return NextResponse.json(sortedPosts)
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const newPost = {
      id: Date.now().toString(),
      content: content.trim(),
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
    }

    posts.unshift(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
