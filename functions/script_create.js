import { Script, wrap, randomUUID, respond, generateRandomUUID } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, author, description } = JSON.parse(event.body)
    const key = randomUUID(Script)
    const secret = generateRandomUUID()

    new Script({
      content, author, description, key, secret, private: true
    }).save()

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
