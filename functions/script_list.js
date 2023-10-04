import { Script, wrap, respond, pickFields } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const includeKeys = event.queryStringParameters.include?.split(',')

    const scripts = await Script.find({ $or: [{ private: { $ne: true } }, { key: { $in: includeKeys } }] }, 'key author created_at updated_at name description version private');

    return respond({
      scripts: scripts.map((script) => pickFields(script, ['author', 'key', 'created_at', 'updated_at', 'name',  'description', 'version', 'private']))
    })
  })
}
