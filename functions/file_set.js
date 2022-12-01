import { Entry, withDatabase, randomUUID, respond } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await withDatabase(context, async () => {
    const { content, multiple } = JSON.parse(event.body);

    try {
      const key = randomUUID(Entry);

      new Entry({
        content, multiple, key
      }).save()

      return respond({ key });
    } catch (e) {
      return respond({ error: e.message });
    }
  });
};
