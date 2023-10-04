import { Script, wrap, respond, pickFields } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const scripts = await Script.find({ private: { $ne: true } }, 'key author created_at updated_at name description version uses');

    return respond({
      scripts: scripts.map((script) => pickFields(script, ['author', 'key', 'created_at', 'updated_at', 'name',  'description', 'version', 'uses']))
    })
  })
}
