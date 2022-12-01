import { Entry, Script, withDatabase, respond } from './../lib/shared'

export async function handler (event, context) {
  return await withDatabase(context, async () => {
    const key = event.queryStringParameters.key;

    try {
      const file = await Entry.findOne({ key }).exec();
      if (!file) throw 'File does not exist';

      const content = file.content;
      if (!file.multiple) {
        file.remove();
      }

      return respond({ content: content });
    } catch (e) {
      return respond({ error: e.message });
    }
  });
};
