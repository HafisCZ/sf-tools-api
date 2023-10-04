import { Script, wrap, randomUUID, respond, generateRandomUUID, pickFields } from '../lib/shared'

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
      script: pickFields(script, ['key', 'secret', 'content', 'created_at', 'updated_at', 'author', 'name', 'description', 'private', 'version', 'uses'])
    })
  });
};
