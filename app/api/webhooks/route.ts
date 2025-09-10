import { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { Webhook } from 'svix'
import { NextApiRequest } from "next"
export async function POST(req: NextApiRequest | NextRequest) {
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = req instanceof NextRequest ? await req.json() : JSON.parse(req.body as string)
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent = await verifyWebhook(req)

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    return NextResponse.json({ error: 'Error occurred', details: err }, {
      status: 400
    })
  }

  // Handle the webhook event here

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data

    // const user = await createUser({
    //   clerkId: id,
    //   email: email_addresses[0].email_address,
    //   fullName: `${first_name} ${last_name}`,
    //   picture: image_url,
    // })

    // await sendNotification(id, 'messageWelcome')

    return NextResponse.json({ message: 'OK' })
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data

    // const user = await updateUser({
    //   clerkId: id,
    //   updatedData: {
    //     email: email_addresses[0].email_address,
    //     fullName: `${first_name} ${last_name}`,
    //     picture: image_url,
    //   },
    // })

    // await sendNotification(id, 'messageProfileUpdated')

    return NextResponse.json({ message: 'OK' })
  }
}