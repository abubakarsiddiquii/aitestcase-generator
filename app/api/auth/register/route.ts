import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { users } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, bio } = await request.json()

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      bio: bio || "",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
