import { Script, wrap, randomUUID, respond, generateRandomUUID } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, author, description } = JSON.parse(event.body)
    const key = await randomUUID(Script)
    const secret = generateRandomUUID()

    const script = new Script({
      content, author, description, key, secret, private: true
    })
    
    await script.save()

    return respond({
      script: {
        key,
        secret,
        content,
        author,
        description,
        private: true
      }
    })
  });
};
