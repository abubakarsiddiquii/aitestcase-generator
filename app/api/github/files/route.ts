import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repo = searchParams.get("repo")
    const token = request.cookies.get("github_token")?.value

    console.log("Files API - Token exists:", !!token)
    console.log("Files API - Repo:", repo)

    if (!token) {
      return NextResponse.json({ error: "No GitHub token found. Please authenticate again." }, { status: 401 })
    }

    if (!repo) {
      return NextResponse.json({ error: "Repository parameter is required" }, { status: 400 })
    }

    // Test token validity first
    const testResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AI-Test-Generator/1.0",
      },
    })

    if (!testResponse.ok) {
      return NextResponse.json({ error: "Invalid or expired GitHub token" }, { status: 401 })
    }

    // Get repository contents recursively
    const getContents = async (path = "") => {
      const url = `https://api.github.com/repos/${repo}/contents/${path}`
      console.log("Fetching:", url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "AI-Test-Generator/1.0",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to fetch contents for ${path}:`, response.status, errorText)

        if (response.status === 404) {
          return [] // Empty repository or path doesn't exist
        }

        throw new Error(`Failed to fetch contents: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    }

    const getAllFiles = async (path = "", files: any[] = [], depth = 0) => {
      // Prevent infinite recursion
      if (depth > 10) {
        console.warn(`Max depth reached for path: ${path}`)
        return files
      }

      try {
        const contents = await getContents(path)

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
            await getAllFiles(item.path, files, depth + 1)
          }
        }
      } catch (error) {
        console.error(`Error processing path ${path}:`, error)
        // Continue processing other paths
      }

      return files
    }

    const files = await getAllFiles()
    console.log(`Found ${files.length} code files`)

    return NextResponse.json(files || [])
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch repository files" }, { status: 500 })
  }
}

function getLanguageFromExtension(filename: string): string {
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
