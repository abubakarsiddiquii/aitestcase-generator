"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileCode, Loader2 } from "lucide-react"

interface CodeFile {
  path: string
  name: string
  type: string
  content?: string
  language?: string
}

interface TestCaseGeneratorProps {
  selectedFiles: CodeFile[]
  onGenerate: () => void
  loading: boolean
}

export function TestCaseGenerator({ selectedFiles, onGenerate, loading }: TestCaseGeneratorProps) {
  const getLanguageStats = () => {
    const stats: Record<string, number> = {}
    selectedFiles.forEach((file) => {
      if (file.language) {
        stats[file.language] = (stats[file.language] || 0) + 1
      }
    })
    return stats
  }

  const getTestFrameworks = () => {
    const languageStats = getLanguageStats()
    const frameworks: string[] = []

    Object.keys(languageStats).forEach((lang) => {
      switch (lang.toLowerCase()) {
        case "javascript":
        case "typescript":
          frameworks.push("Jest", "React Testing Library")
          break
        case "python":
          frameworks.push("pytest", "unittest", "Selenium")
          break
        case "java":
          frameworks.push("JUnit", "TestNG")
          break
        case "c#":
          frameworks.push("NUnit", "xUnit")
          break
        default:
          frameworks.push("Generic Testing Framework")
      }
    })

    return [...new Set(frameworks)]
  }

  const languageStats = getLanguageStats()
  const frameworks = getTestFrameworks()

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <CardTitle>Generate AI Test Cases</CardTitle>
          <CardDescription>
            AI will analyze your selected files and generate comprehensive test case summaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file) => (
                  <div key={file.path} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-mono">{file.path}</span>
                    {file.language && (
                      <Badge variant="outline" className="text-xs">
                        {file.language}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Analysis Summary</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Languages Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(languageStats).map(([lang, count]) => (
                      <Badge key={lang} variant="secondary">
                        {lang} ({count})
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Test Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.map((framework) => (
                      <Badge key={framework} className="bg-green-100 text-green-800">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What AI will generate:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Unit test cases for individual functions and methods</li>
              <li>• Integration test scenarios for component interactions</li>
              <li>• Edge case and error handling tests</li>
              <li>• Mock and stub implementations where needed</li>
              <li>• Test data setup and teardown procedures</li>
            </ul>
          </div>

          <div className="text-center">
            <Button
              onClick={onGenerate}
              disabled={loading || selectedFiles.length === 0}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Code & Generating Summaries...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Test Case Summaries
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
