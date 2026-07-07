import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"
import Stripe from "stripe"

const http = httpRouter()

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const signature = request.headers.get("stripe-signature")
    const body = await request.text()

    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (err) {
      console.error("Stripe webhook signature verification failed", err)
      return new Response("Invalid signature", { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkId = session.client_reference_id ?? session.metadata?.clerkId
      if (!clerkId) {
        console.error("checkout.session.completed with no clerkId (client_reference_id/metadata)", session.id)
        return new Response("Missing clerkId", { status: 400 })
      }
      const email = session.customer_details?.email ?? session.customer_email ?? undefined
      await ctx.runMutation(internal.eduAccess.grantEduAccess, { clerkId, email })
    }

    return new Response(null, { status: 200 })
  }),
})

export default http
