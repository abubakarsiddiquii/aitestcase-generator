import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { users } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const result = await signIn(email, password)

    if (result.success) {
      const user = users.find((u) => u.email === email)

      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" })
      }

      const session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      }

      const response = NextResponse.json({ success: true, session })

      // Set session cookie
      response.cookies.set("session", JSON.stringify({ userId: user.id }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    } else {
      return NextResponse.json({ success: false, error: result.error })
    }
  } catch (error) {
    console.error("Sign in API error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
