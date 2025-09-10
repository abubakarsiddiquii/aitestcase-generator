import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Shield, Headphones } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Omniplex AI Dashboard</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Crown className="h-3 w-3 mr-1" />
                Pro Plan
              </Badge>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI Processing
              </CardTitle>
              <CardDescription>Advanced AI capabilities now available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Requests this month:</span>
                  <span className="font-semibold">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing speed:</span>
                  <span className="font-semibold text-green-600">Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Security & Access
              </CardTitle>
              <CardDescription>Enhanced security features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>API Access:</span>
                  <span className="font-semibold text-green-600">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Data encryption:</span>
                  <span className="font-semibold">Enterprise-grade</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-blue-500" />
                Support
              </CardTitle>
              <CardDescription>Priority customer support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Support level:</span>
                  <span className="font-semibold text-blue-600">Priority</span>
                </div>
                <div className="flex justify-between">
                  <span>Response time:</span>
                  <span className="font-semibold">{"< 2 hours"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Pro Features</CardTitle>
              <CardDescription>Explore the advanced capabilities now available to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold mb-1">API Documentation</div>
                  <div className="text-sm opacity-80">Learn how to integrate our API</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col items-start bg-transparent">
                  <div className="font-semibold mb-1">Advanced Tutorials</div>
                  <div className="text-sm opacity-80">Master Pro-level features</div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
