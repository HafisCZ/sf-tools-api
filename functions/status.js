import { Entry, Script, withDatabase, respond } from './../lib/shared'

export async function handler (event, context) {
  return await withDatabase(context, async () => {
    try {
      const file_total = await Entry.countDocuments();
      const file_multiple = await Entry.countDocuments({ multiple: true });
      const script_total = await Script.countDocuments();
      const script_private = await Script.countDocuments({ private: true });

      return respond({
        files: {
          count: file_total,
          single_use: file_total - file_multiple,
          expire_use: file_multiple,
        },
        scripts: {
            count: script_total,
            private: script_private,
            public: script_total - script_private
        }
      });
    } catch (e) {
      return respond({});
    }
  });
};
