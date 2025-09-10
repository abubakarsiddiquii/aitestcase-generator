import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const user = users.find((u) => u.id === params.userId)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Don't return password
  const { password, ...userWithoutPassword } = user

  return NextResponse.json(userWithoutPassword)
}
