"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Download, GitPullRequest, Copy, Check, Loader2, ArrowLeft } from "lucide-react"

interface GeneratedTest {
  id: string
  summaryId: string
  code: string
  filename: string
  framework: string
}

interface TestCodeViewerProps {
  tests: GeneratedTest[]
  onCreatePR: (test: GeneratedTest) => void
  loading: boolean
}

export function TestCodeViewer({ tests, onCreatePR, loading }: TestCodeViewerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyCode = async (test: GeneratedTest) => {
    await navigator.clipboard.writeText(test.code)
    setCopiedId(test.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownload = (test: GeneratedTest) => {
    const blob = new Blob([test.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = test.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generated Test Code</h2>
        <p className="text-gray-600">Review and use the AI-generated test cases for your project</p>
      </div>

      {tests.length > 0 ? (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {tests.length} Test{tests.length !== 1 ? "s" : ""} Generated
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => window.history.back()} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Generate More Tests
              </Button>
            </div>
          </div>

          <Tabs defaultValue={tests[0]?.id} className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tests.map((test) => (
                <TabsTrigger key={test.id} value={test.id} className="text-left">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{test.filename}</span>
                    <Badge variant="outline" className="text-xs mt-1">
                      {test.framework}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {tests.map((test) => (
              <TabsContent key={test.id} value={test.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-blue-600" />
                          {test.filename}
                        </CardTitle>
                        <CardDescription>Generated test code using {test.framework}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopyCode(test)}>
                          {copiedId === test.id ? (
                            <>
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(test)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onCreatePR(test)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating PR...
                            </>
                          ) : (
                            <>
                              <GitPullRequest className="mr-2 h-4 w-4" />
                              Create PR
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
                        <code>{test.code}</code>
                      </pre>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Usage Instructions:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>1. Copy or download the test code</li>
                        <li>2. Add it to your project's test directory</li>
                        <li>3. Install required testing dependencies if needed</li>
                        <li>4. Run the tests using your testing framework</li>
                        <li>5. Or create a PR to add tests directly to your repository</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No test code generated yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
