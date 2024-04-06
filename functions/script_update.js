import { Script, wrap, respond, pickFields, sendWebhook } from '../lib/shared'

export async function handler (event, context) {
  if (!event.body) {
    return respond({ error: 'Content missing' })
  }

  return await wrap(context, async () => {
    const { content, key, secret, author, version, name, description, visibility } = JSON.parse(event.body)

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

    if (name) {
      script.name = name
    }

    if (description) {
      script.description = description
    }

    if (author) {
      script.author = author
    }

    if (visibility) {
      script.visibility = visibility

      if (visibility === 'public' && !script.verified) {
        sendWebhook(
          process.env.VERIFICATION_WEBHOOK_URL,
          {
            content: `[${key}] Request for verification`
          }
        )
      }
    }

    script.updated_at = Date.now()

    await script.save()

    return respond({
      script: pickFields(script, ['key', 'secret', 'content', 'created_at', 'updated_at', 'author', 'name', 'description', 'visibility', 'verified', 'version', 'uses'])
    })
  });
};
