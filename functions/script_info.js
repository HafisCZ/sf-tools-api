import { Script, wrap, respond, pickFields } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const secret = event.queryStringParameters.secret

    const script = await Script.findOne({ key }).exec()
    if (!script) {
      return respond({ error: 'Script does not exist' })
    }

    const fields = script.secret === secret ? [
      'key', 'secret', 'created_at', 'updated_at', 'author', 'name', 'description', 'visibility', 'verified', 'version', 'uses'
    ] : [
      'key', 'created_at', 'updated_at', 'author', 'name', 'description', 'visibility', 'verified', 'version', 'uses'
    ]

    return respond({
      script: pickFields(script, fields)
    })
  });
};
