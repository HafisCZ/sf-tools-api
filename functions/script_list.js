import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const scripts = await Script.find({ private: { $ne: true } }, 'key author created_at updated_at description version uses');

    return respond({
      scripts: scripts.map(script => ({
        author: script.author,
        key: script.key,
        created_at: script.created_at,
        updated_at: script.updated_at,
        description: script.description,
        version: script.version,
        uses: script.uses
      }))
    })
  })
}
