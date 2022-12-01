const { Entry, connectToDatabase } = require('./../shared');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();

  const key = event.queryStringParameters.key;

  try {
    const file = await Entry.findOne({ key }).exec();
    if (!entry) {
      throw 'err';
    }

    if (!file.multiple) {
      file.remove();
    }

    return {
      statusCode: 200,
      body: file.content
    }
  } catch (e) {
    return {
      statusCode: 200,
      body: ''
    }
  }
};
