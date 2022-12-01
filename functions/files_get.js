const { Entry, withDatabase, respond } = require('./../shared');

module.exports.handler = async (event, context) => {
  return await withDatabase(context, async () => {
    const key = event.queryStringParameters.key;

    try {
      const file = await Entry.findOne({ key }).exec();
      if (!file) throw 'err';

      const body = file.content;
      if (!file.multiple) {
        file.remove();
      }

      return respond(body);
    } catch (e) {
      return respond('');
    }
  });
};
