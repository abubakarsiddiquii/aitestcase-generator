"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleStripeCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          priceId: "price_test_pro_plan", // This would be your actual Stripe price ID
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDirectPayment = () => {
    // For demo purposes, simulate a successful payment
    window.location.href = "/success?session_id=demo_session_123"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Upgrade to Pro Plan
            </CardTitle>
            <CardDescription>Complete your purchase to unlock all Pro features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Pro Plan - $10/month</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Advanced AI features</li>
                <li>• Unlimited requests</li>
                <li>• Priority support</li>
                <li>• API access</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Button onClick={handleStripeCheckout} disabled={loading || !email} className="w-full" size="lg">
                  {loading ? "Processing..." : "Pay with Stripe Checkout"}
                </Button>

                <div className="text-center text-sm text-gray-500">or</div>

                <Button onClick={handleDirectPayment} variant="outline" className="w-full bg-transparent" size="lg">
                  Demo Payment (Test Mode)
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                Secure payment powered by Stripe
              </div>

              <div className="text-xs text-gray-400 text-center">
                Test card: 4242 4242 4242 4242 | Any future date | Any CVC
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
