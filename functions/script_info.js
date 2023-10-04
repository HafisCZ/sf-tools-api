import { Script, wrap, respond, pickFields } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const secret = event.queryStringParameters.secret

    const script = await Script.findOne({ key }).exec()
    if (!script || script.secret != secret) {
      return respond({ error: 'Script does not exist or secret key is not valid' })
    }

    return respond({
      script: pickFields(script, ['key', 'secret', 'content', 'created_at', 'updated_at', 'author', 'name', 'description', 'private', 'version', 'uses'])
    })
  });
};
