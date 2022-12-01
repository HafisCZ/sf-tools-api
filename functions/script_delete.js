import { Script, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const secret = event.queryStringParameters.secret

    const script = await Script.findOne({ key }).exec()
    if (!script || script.secret != secret) {
      return respond({ error: 'Script does not exist or secret key is not valid' })
    }

    script.remove()

    return respond({
      script: null
    })
  })
}
