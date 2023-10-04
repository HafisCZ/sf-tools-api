import { File, wrap, respond } from '../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const key = event.queryStringParameters.key
    const file = await File.findOne({ key }).exec()
    if (!file) {
      return respond({ error: 'File does not exist' })
    }

    const content = file.content
    if (!file.multiple) {
      file.remove()
    }

    return respond({
      file: {
        content
      }
    })
  });
};
