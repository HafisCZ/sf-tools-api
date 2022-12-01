import { Script, wrap, randomUUID, respond, generateRandomUUID } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, key, secret, author, description } = JSON.parse(event.body)

    const script = await Script.findOne({ key }).exec()
    if (!script || script.secret != secret) {
      return respond({ error: 'Script does not exist or secret key is not valid' })
    }

    if (content) {
      script.content = content
    }

    if (description) {
      script.description = description
    }

    if (author) {
      script.author = author
    }

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
