import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const secret = event.queryStringParameters.secret

    const script = await Script.findOne({ key }).exec()
    if (!script || script.secret != secret) {
      return respond({ error: 'Script does not exist or secret key is not valid' })
    }

    return respond({
      script: {
        key: script.key,
        secret: script.secret,
        content: script.content,
        created_at: script.created_at,
        updated_at: script.updated_at,
        author: script.author,
        description: script.description,
        private: script.private,
        version: script.version,
        uses: script.uses
      }
    })
  });
};
