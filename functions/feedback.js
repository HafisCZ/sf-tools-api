import { wrap, respond, sendWebhook } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { tool, type, email, description } = JSON.parse(event.body)

    await sendWebhook(
      process.env.FEEDBACK_WEBHOOK_URL,
      {
        embeds: [{
          fields: [
            {
              name: 'tool',
              value: tool
            },
            {
              name: 'type',
              value: type
            },
            {
              name: 'email',
              value: email
            },
            {
              name: 'description',
              value: description
            }
          ]
        }]
      }
    )

    return respond({})
  });
};
