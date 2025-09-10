import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  // Check for required environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY is not set")
    return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
  }

  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 })
  }

  // Initialize Stripe inside the request handler
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  })

  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    console.error("Missing stripe-signature header")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      console.log("Payment successful:", session.id)

      // Here you would typically:
      // 1. Update user's subscription status in your database
      // 2. Send confirmation email
      // 3. Enable Pro features for the user

      break
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription
      console.log("Subscription cancelled:", subscription.id)

      // Handle subscription cancellation
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
