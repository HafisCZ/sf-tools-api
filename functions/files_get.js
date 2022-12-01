const { Entry, withDatabase } = require('./../shared');

module.exports.handler = async (event, context) => {
  await withDatabase(context);

  const key = event.queryStringParameters.key;

  try {
    const file = await Entry.findOne({ key }).exec();
    if (!entry) {
      throw 'err';
    }

    const content = file.content;

    if (!file.multiple) {
      file.remove();
    }

    return {
      statusCode: 200,
      body: content
    }
  } catch (e) {
    return {
      statusCode: 200,
      body: ''
    }
  }
};
