"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestTube, Code, Clock, Loader2 } from "lucide-react"

interface TestSummary {
  id: string
  title: string
  description: string
  framework: string
  files: string[]
  complexity: "low" | "medium" | "high"
}

interface TestCaseSummaryProps {
  summaries: TestSummary[]
  onGenerateCode: (summary: TestSummary) => void
  loading: boolean
}

export function TestCaseSummary({ summaries, onGenerateCode, loading }: TestCaseSummaryProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "🟢"
      case "medium":
        return "🟡"
      case "high":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Case Summaries</h2>
        <p className="text-gray-600">AI has analyzed your code and generated {summaries.length} test case summaries</p>
      </div>

      <div className="grid gap-6">
        {summaries.map((summary) => (
          <Card key={summary.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-blue-600" />
                    {summary.title}
                  </CardTitle>
                  <CardDescription>{summary.description}</CardDescription>
                </div>
                <Badge className={getComplexityColor(summary.complexity)}>
                  {getComplexityIcon(summary.complexity)} {summary.complexity.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Framework
                  </h4>
                  <Badge variant="outline">{summary.framework}</Badge>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Target Files ({summary.files.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {summary.files.slice(0, 3).map((file) => (
                      <Badge key={file} variant="secondary" className="text-xs">
                        {file.split("/").pop()}
                      </Badge>
                    ))}
                    {summary.files.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{summary.files.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Test Coverage Areas:</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• Function/Method testing</div>
                  <div>• Error handling scenarios</div>
                  <div>• Edge case validation</div>
                  <div>• Integration testing</div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => onGenerateCode(summary)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Code...
                    </>
                  ) : (
                    <>
                      <Code className="mr-2 h-4 w-4" />
                      Generate Test Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {summaries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No test summaries generated yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
