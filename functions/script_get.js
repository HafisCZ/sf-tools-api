import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const script = await Script.findOne({ key }).exec()
    if (!script) {
      return respond({ error: 'Script does not exist' })
    }

    return respond({
      script: {
        content: script.content,
        date: script.date,
        author: script.author,
        description: script.description,
        private: script.private,
        version: script.version
      }
    })
  });
};
