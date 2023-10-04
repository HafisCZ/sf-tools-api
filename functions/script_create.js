import { Script, wrap, randomUUID, respond, generateRandomUUID } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, author, name, description, version } = JSON.parse(event.body)

    const key = await randomUUID(Script)
    const secret = generateRandomUUID()

    const script = new Script({
      content, author, name, description, key, secret, version, private: true
    })
    
    await script.save()

    return respond({
      script: {
        key: script.key,
        secret: script.secret,
        content: script.content,
        created_at: script.created_at,
        updated_at: script.updated_at,
        author: script.author,
        name: script.name,
        description: script.description,
        private: script.private,
        version: script.version,
        uses: script.uses
      }
    })
  });
};
