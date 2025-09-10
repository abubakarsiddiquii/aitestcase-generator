"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Key, Loader2 } from "lucide-react"

interface GitHubUser {
  login: string
  name: string
  avatar_url: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  language: string
}

interface GitHubIntegrationProps {
  onAuth: (user: GitHubUser, repos: Repository[], token: string) => void
}

export function GitHubIntegration({ onAuth }: GitHubIntegrationProps) {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null)

  const handleAuth = async () => {
    if (!token.trim()) {
      setError("Please enter a GitHub token")
      return
    }

    setLoading(true)
    setError("")

    try {
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "AI-Test-Generator/1.0",
        },
      })

      if (!userResponse.ok) {
        throw new Error("Invalid GitHub token")
      }

      const user = await userResponse.json()

      const reposResponse = await fetch(
        "https://api.github.com/user/repos?sort=updated&per_page=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "AI-Test-Generator/1.0",
          },
        }
      )

      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories")
      }

      const repositories = await reposResponse.json()

      const userData = {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
      }

      const repoData = repositories.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || "",
        language: repo.language || "Unknown",
      }))

      setIsConnected(true)
      setUserInfo(userData)
      localStorage.setItem("github_token", token)
      onAuth(userData, repoData, token)
    } catch (error: any) {
      console.error("GitHub auth error:", error)
      setError("Authentication failed. Please check your token.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        {isConnected && userInfo ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Github className="h-8 w-8" />
                <div>
                  <h3 className="font-semibold">{userInfo.name}</h3>
                  <p className="text-sm text-gray-600">@{userInfo.login}</p>
                </div>
              </div>
              <p className="text-green-600">✅ Successfully connected to GitHub!</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center">
                <Github className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Connect to GitHub</CardTitle>
              <CardDescription>
                Enter your GitHub Personal Access Token to access your repositories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">GitHub Personal Access Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <p className="text-sm text-gray-600">
                  Create a token at{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub Settings → Developer settings → Personal access tokens
                  </a>
                </p>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button onClick={handleAuth} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Connect GitHub
                  </>
                )}
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Required Permissions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • <strong>repo</strong> - Access to repository contents
                  </li>
                  <li>
                    • <strong>read:user</strong> - Read user profile information
                  </li>
                  <li>
                    • <strong>pull_requests:write</strong> - Create pull requests (optional)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full-width footer outside the container */}
      <footer
        className="w-full text-center mt-20"
        style={{ boxSizing: "border-box" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Github className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-500 font-semibold text-lg">AI Test Case Generator</span>
          </div>

          <p className="text-gray-400 text-sm">Code smarter. Test faster. AI-powered.</p>

          <div className="h-[1px] w-full bg-blue-300 my-0" />

          <p className="text-gray-500 text-xs">
             © {new Date().getFullYear()} AI Test Case Generator by Abubakar Siddiqui. All rights reserved.
             <br /> PR is welcome!
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-3 text-sm">
            <a href="#" className="text-gray-400 hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              Terms of Service
            </a>
            <a
              href="https://github.com/abubakarsiddiquii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abubakarsiddiquii/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400"
            >
              LinkedIn
            </a>
            <a
              href="https://abubakarsportfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400"
            >
              Portfolio
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
