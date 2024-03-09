import { Script, wrap, respond, pickFields } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const includeKeys = event.queryStringParameters.include?.split(',')

    const scripts = await Script.find({ $or: [{ $and: [{ visibility: { $eq: 'public' } }, { verified: { $eq: true } }] }, { key: { $in: includeKeys } }] }, 'key author created_at updated_at name description version visibility verified uses');

    return respond({
      scripts: scripts.map((script) => pickFields(script, ['author', 'key', 'created_at', 'updated_at', 'name',  'description', 'version', 'visibility', 'verified', 'uses']))
    })
  })
}
