import { Entry, wrap, randomUUID, respond } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, multiple } = JSON.parse(event.body)
    const key = randomUUID(Entry)

    new Entry({
      content, multiple, key
    }).save()

    return respond({
      file: {
        key
      }
    })
  });
};
