import { Script, wrap, respond, pickFields } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const script = await Script.findOneAndUpdate({ key }, { $inc: { uses: 1 } }, { new: true }).exec()
    if (!script) {
      return respond({ error: 'Script does not exist' })
    }

    return respond({
      script: pickFields(script, ['key', 'content', 'created_at', 'updated_at', 'author', 'name', 'description', 'visibility', 'verified', 'version', 'uses'])
    })
  });
};
