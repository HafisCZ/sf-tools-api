const { Entry, Script, withDatabase, respond } = require('./../shared');

module.exports.handler = async (event, context) => {
  return await withDatabase(context, async () => {
    try {
      const total = await Entry.countDocuments();
      const multipleuse = await Entry.countDocuments({ multiple: true });
      const totals = await Script.countDocuments();
      const private = await Script.countDocuments({ private: true });

      return respond({
        files: {
          count: total,
          singleUseOnly: total - multipleuse,
          expireOnly: multipleuse,
        },
        scripts: {
            count: totals,
            privateScripts: private,
            publicScripts: totals - private
        }
      });
    } catch (e) {
      return respond({ total: -1 });
    }
  });
};
