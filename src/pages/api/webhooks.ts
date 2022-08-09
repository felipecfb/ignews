import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readble: Readable) {
  const chunks = []

  for await (const chunk of readble){
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    )
  }
  
  return Buffer.concat(chunks)
}

export const config = {
  api:{
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
])
// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST'){
    const buff = await buffer(request)
    const secret = request.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buff, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      return response.status(400).send(`Webhook error: ${err.message}`)
    }

    const { type } = event

    if (relevantEvents.has(type)){
      console.log('Evento recebido', event)
      try {
        switch (type){
          case 'checkout.session.completed':

          const checkoutSession = event.data.object as Stripe.Checkout.Session
          
          await saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString()
          )

          default:
            throw new Error('Unhandled event.')
        }
      } catch (err) {
        return response.json({ error: 'Webhook handler failed.'})
      }
    }

    response.status(200).json({received: true})
  } else {
    response.setHeader('Allow', "POST")
    response.status(405).end('Method not allowed')
  }

}