"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileCode, Folder, ChevronRight, ChevronDown } from "lucide-react"

interface CodeFile {
  path: string
  name: string
  type: string
  content?: string
  language?: string
}

interface FileExplorerProps {
  files: CodeFile[]
  onFilesSelect: (files: CodeFile[]) => void
  loading: boolean
}

export function FileExplorer({ files, onFilesSelect, loading }: FileExplorerProps) {
  const [selectedFiles, setSelectedFiles] = useState<CodeFile[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Ensure files is always an array
  const safeFiles = Array.isArray(files) ? files : []

  const handleFileToggle = (file: CodeFile, checked: boolean) => {
    if (checked) {
      setSelectedFiles((prev) => [...prev, file])
    } else {
      setSelectedFiles((prev) => prev.filter((f) => f.path !== file.path))
    }
  }

  const handleFolderToggle = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  const buildFileTree = (files: CodeFile[]) => {
    const tree: any = {}

    if (!Array.isArray(files) || files.length === 0) {
      return tree
    }

    files.forEach((file) => {
      const parts = file.path.split("/")
      let current = tree

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            type: index === parts.length - 1 ? "file" : "folder",
            children: {},
            file: index === parts.length - 1 ? file : null,
          }
        }
        current = current[part].children
      })
    })

    return tree
  }

  const renderTree = (node: any, level = 0) => {
    return Object.values(node).map((item: any) => (
      <div key={item.path} style={{ marginLeft: `${level * 20}px` }}>
        {item.type === "folder" ? (
          <div>
            <div
              className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded"
              onClick={() => handleFolderToggle(item.path)}
            >
              {expandedFolders.has(item.path) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Folder className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{item.name}</span>
            </div>
            {expandedFolders.has(item.path) && renderTree(item.children, level + 1)}
          </div>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <div className="w-4" />
            <Checkbox
              checked={selectedFiles.some((f) => f.path === item.file.path)}
              onCheckedChange={(checked) => handleFileToggle(item.file, checked as boolean)}
            />
            <FileCode className="h-4 w-4 text-gray-600" />
            <span className="text-sm">{item.name}</span>
            {item.file.language && (
              <Badge variant="outline" className="text-xs">
                {item.file.language}
              </Badge>
            )}
          </div>
        )}
      </div>
    ))
  }

  const fileTree = buildFileTree(safeFiles.filter((f) => f.type === "file"))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Files for Testing</CardTitle>
        <CardDescription>Choose the code files you want to generate test cases for</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
              {Object.keys(fileTree).length > 0 ? (
                renderTree(fileTree)
              ) : safeFiles.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No code files found in this repository</p>
              ) : (
                <p className="text-gray-500 text-center py-4">No files to display</p>
              )}
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Selected Files ({selectedFiles.length})</span>
                  <Button onClick={() => onFilesSelect(selectedFiles)} size="sm">
                    Generate Test Cases
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file) => (
                    <Badge key={file.path} variant="secondary">
                      {file.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
