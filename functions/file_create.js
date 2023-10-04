import { File, wrap, randomUUID, respond } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, multiple } = JSON.parse(event.body)
    const key = await randomUUID(File)

    const file = new File({
      content, multiple, key
    })
    
    await file.save()

    return respond({
      file: {
        key
      }
    })
  });
};
