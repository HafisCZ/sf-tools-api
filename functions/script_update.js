import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, key, secret, author, version, description } = JSON.parse(event.body)

    const script = await Script.findOne({ key }).exec()
    if (!script || script.secret != secret) {
      return respond({ error: 'Script does not exist or secret key is not valid' })
    }

    if (version) {
      script.version = version
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

    script.updated_at = Date.now()

    await script.save()

    return respond({
      script: {
        key,
        secret,
        content,
        author,
        description,
        version,
        private: true,
        uses: 0
      }
    })
  });
};
