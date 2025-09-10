import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession()

    if (session) {
      return NextResponse.json(session)
    } else {
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json(null)
  }
}
