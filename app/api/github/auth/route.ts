import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Verify token and get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AI-Test-Generator/1.0",
      },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error("GitHub API error:", errorText)
      return NextResponse.json({ error: "Invalid GitHub token" }, { status: 401 })
    }

    const user = await userResponse.json()

    // Get user repositories
    const reposResponse = await fetch("https://api.github.com/user/repos?sort=updated&per_page=50", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AI-Test-Generator/1.0",
      },
    })

    if (!reposResponse.ok) {
      const errorText = await reposResponse.text()
      console.error("GitHub repos API error:", errorText)
      return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
    }

    const repositories = await reposResponse.json()

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
      },
      repositories: repositories.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || "",
        language: repo.language || "Unknown",
      })),
    })

    // Set token in httpOnly cookie
    response.cookies.set("github_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("GitHub auth error:", error)
    return NextResponse.json({ error: "Internal server error during authentication" }, { status: 500 })
  }
}
