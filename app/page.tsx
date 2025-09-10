"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitHubIntegration } from "@/components/github-integration"
import { FileExplorer } from "@/components/file-explorer"
import { TestCaseGenerator } from "@/components/test-case-generator"
import { TestCaseSummary } from "@/components/test-case-summary"
import { TestCodeViewer } from "@/components/test-code-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, FileCode, TestTube, Sparkles, AlertCircle, ArrowLeft, RotateCcw, Home } from "lucide-react"

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

interface CodeFile {
  path: string
  name: string
  type: string
  content?: string
  language?: string
}

interface TestSummary {
  id: string
  title: string
  description: string
  framework: string
  files: string[]
  complexity: "low" | "medium" | "high"
}

interface GeneratedTest {
  id: string
  summaryId: string
  code: string
  filename: string
  framework: string
}

export default function HomePage() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<CodeFile[]>([])
  const [testSummaries, setTestSummaries] = useState<TestSummary[]>([])
  const [generatedTests, setGeneratedTests] = useState<GeneratedTest[]>([])
  const [currentStep, setCurrentStep] = useState<"auth" | "files" | "generate" | "summary" | "code">("auth")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [githubToken, setGithubToken] = useState<string>("")

  // Check for existing token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("github_token")
    if (savedToken) {
      setGithubToken(savedToken)
      // Optionally auto-authenticate with saved token
    }
  }, [])

  const handleGitHubAuth = async (userData: GitHubUser, repos: Repository[], token: string) => {
    setUser(userData)
    setRepositories(repos)
    setGithubToken(token)
    setCurrentStep("files")
    setError("")
  }

  const handleRepoSelect = async (repo: Repository) => {
    setSelectedRepo(repo)
    setLoading(true)
    setCodeFiles([])
    setError("")

    try {
      console.log("Fetching files for repo:", repo.full_name)
      console.log("Using token:", githubToken ? "Token available" : "No token")

      if (!githubToken) {
        throw new Error("No GitHub token available. Please authenticate again.")
      }

      // Fetch files directly from GitHub API using client-side token
      const response = await fetch(`https://api.github.com/repos/${repo.full_name}/contents`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "AI-Test-Generator/1.0",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
      }

      const contents = await response.json()

      // Process files recursively
      const files = await getAllFiles(repo.full_name, "", githubToken)

      console.log("Received files:", files.length)

      if (Array.isArray(files)) {
        setCodeFiles(files)
        if (files.length === 0) {
          setError("No code files found in this repository. Try selecting a different repository.")
        }
      } else {
        console.error("Invalid response format:", files)
        setCodeFiles([])
        setError("Invalid response format from GitHub API")
      }
    } catch (error: any) {
      console.error("Error fetching files:", error)
      setError(`Failed to fetch files: ${error.message}`)
      setCodeFiles([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to recursively get all files
  const getAllFiles = async (repo: string, path = "", token: string, depth = 0): Promise<CodeFile[]> => {
    if (depth > 10) return [] // Prevent infinite recursion

    try {
      const url = `https://api.github.com/repos/${repo}/contents/${path}`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "AI-Test-Generator/1.0",
        },
      })

      if (!response.ok) {
        console.error(`Failed to fetch ${path}:`, response.status)
        return []
      }

      const contents = await response.json()
      if (!Array.isArray(contents)) return []

      const files: CodeFile[] = []

      for (const item of contents) {
        if (item.type === "file") {
          // Filter for code files
          const codeExtensions = [
            ".js",
            ".ts",
            ".jsx",
            ".tsx",
            ".py",
            ".java",
            ".cs",
            ".cpp",
            ".c",
            ".php",
            ".rb",
            ".go",
            ".rs",
            ".vue",
            ".svelte",
            ".dart",
            ".kt",
            ".swift",
          ]

          const hasCodeExtension = codeExtensions.some((ext) => item.name.endsWith(ext))

          if (hasCodeExtension) {
            files.push({
              path: item.path,
              name: item.name,
              type: item.type,
              language: getLanguageFromExtension(item.name),
            })
          }
        } else if (
          item.type === "dir" &&
          !item.name.startsWith(".") &&
          !["node_modules", "dist", "build", "__pycache__", "target", "vendor"].includes(item.name)
        ) {
          // Recursively get files from subdirectories
          const subFiles = await getAllFiles(repo, item.path, token, depth + 1)
          files.push(...subFiles)
        }
      }

      return files
    } catch (error) {
      console.error(`Error processing ${path}:`, error)
      return []
    }
  }

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      js: "JavaScript",
      jsx: "JavaScript",
      ts: "TypeScript",
      tsx: "TypeScript",
      py: "Python",
      java: "Java",
      cs: "C#",
      cpp: "C++",
      c: "C",
      php: "PHP",
      rb: "Ruby",
      go: "Go",
      rs: "Rust",
      vue: "Vue",
      svelte: "Svelte",
      dart: "Dart",
      kt: "Kotlin",
      swift: "Swift",
    }
    return languageMap[ext || ""] || "Unknown"
  }

  const handleFilesSelect = (files: CodeFile[]) => {
    setSelectedFiles(files)
    if (files.length > 0) {
      setCurrentStep("generate")
    }
  }

  const handleGenerateTestSummaries = async () => {
    setLoading(true)
    setCurrentStep("summary")

    try {
      const response = await fetch("/api/ai/generate-summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: selectedFiles,
          repository: selectedRepo?.name,
        }),
      })

      const summaries = await response.json()
      setTestSummaries(summaries)
    } catch (error) {
      console.error("Error generating summaries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTestCode = async (summary: TestSummary) => {
    setLoading(true)

    try {
      const response = await fetch("/api/ai/generate-test-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          files: selectedFiles,
        }),
      })

      const testCode = await response.json()
      setGeneratedTests((prev) => [...prev, testCode])
      setCurrentStep("code")
    } catch (error) {
      console.error("Error generating test code:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePR = async (test: GeneratedTest) => {
    setLoading(true)

    try {
      const response = await fetch("/api/github/create-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository: selectedRepo?.full_name,
          test,
          branch: `test-cases-${Date.now()}`,
          token: githubToken,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert(`PR created successfully: ${result.pr_url}`)
      }
    } catch (error) {
      console.error("Error creating PR:", error)
    } finally {
      setLoading(false)
    }
  }

  // Navigation functions
  const goToStep = (step: "auth" | "files" | "generate" | "summary" | "code") => {
    setCurrentStep(step)
    setError("")
  }

  const goBack = () => {
    const stepOrder = ["auth", "files", "generate", "summary", "code"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1] as any)
    }
  }

  const startOver = () => {
    // Reset all state
    setSelectedRepo(null)
    setCodeFiles([])
    setSelectedFiles([])
    setTestSummaries([])
    setGeneratedTests([])
    setCurrentStep("files")
    setError("")
  }

  const logout = () => {
    // Clear all data and logout
    localStorage.removeItem("github_token")
    setUser(null)
    setRepositories([])
    setSelectedRepo(null)
    setCodeFiles([])
    setSelectedFiles([])
    setTestSummaries([])
    setGeneratedTests([])
    setGithubToken("")
    setCurrentStep("auth")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="AI Test Case Generator Logo"
              width={80}
              height={80}
              className="rounded"
            />
            AI Test Case Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatically generate comprehensive test cases for your GitHub repositories using AI
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Navigation Controls */}
          {user && (
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={goBack} disabled={currentStep === "auth"} size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                {currentStep !== "files" && (
                  <Button variant="outline" onClick={startOver} size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Logged in as <strong>{user.name}</strong>
                </div>
                <Button variant="outline" onClick={logout} size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={currentStep} onValueChange={(value) => goToStep(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="auth" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </TabsTrigger>
              <TabsTrigger value="files" disabled={!user} className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="generate" disabled={selectedFiles.length === 0} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="summary" disabled={testSummaries.length === 0} className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="code" disabled={generatedTests.length === 0} className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auth">
              <GitHubIntegration onAuth={handleGitHubAuth} />
            </TabsContent>

            <TabsContent value="files">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Repository</CardTitle>
                    <CardDescription>Choose a repository to analyze</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {repositories.map((repo) => (
                        <div
                          key={repo.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedRepo?.id === repo.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                          onClick={() => handleRepoSelect(repo)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{repo.name}</h3>
                              <p className="text-sm text-gray-600">{repo.description}</p>
                            </div>
                            {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedRepo && <FileExplorer files={codeFiles} onFilesSelect={handleFilesSelect} loading={loading} />}
              </div>
            </TabsContent>

            <TabsContent value="generate">
              <TestCaseGenerator
                selectedFiles={selectedFiles}
                onGenerate={handleGenerateTestSummaries}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="summary">
              <TestCaseSummary summaries={testSummaries} onGenerateCode={handleGenerateTestCode} loading={loading} />
            </TabsContent>

            <TabsContent value="code">
              <TestCodeViewer tests={generatedTests} onCreatePR={handleCreatePR} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
