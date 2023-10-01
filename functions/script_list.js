import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const scripts = await Script.find({ private: { $ne: true } }, 'key author date description version uses');

    return respond({
      scripts: scripts.map(script => ({
        author: script.author,
        key: script.key,
        date: script.date,
        description: script.description,
        version: script.version,
        uses: script.uses
      }))
    })
  })
}
