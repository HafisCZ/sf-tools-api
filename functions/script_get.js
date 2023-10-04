import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const script = await Script.findOneAndUpdate({ key }, { $inc: { uses: 1 } }, { new: true }).exec()
    if (!script) {
      return respond({ error: 'Script does not exist' })
    }

    return respond({
      script: {
        key: script.key,
        content: script.content,
        created_at: script.created_at,
        updated_at: script.updated_at,
        author: script.author,
        description: script.description,
        private: script.private,
        version: script.version
      }
    })
  });
};
