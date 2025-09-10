import { cookies } from "next/headers"
import { users } from "@/lib/data"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  name: string
}

export interface Session {
  user: User
}

// Simple session management using cookies
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)
    const user = users.find((u) => u.id === sessionData.userId)

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export function signOut(): void {
  // This will be handled on the client side by clearing cookies
}
