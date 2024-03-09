import { File, Script, wrap, respond } from './../lib/shared'

export async function handler (event, context) {
  return await wrap(context, async () => {
    const file_total = await File.countDocuments()
    const file_multiple = await File.countDocuments({ multiple: true })
    const script_total = await Script.countDocuments()
    const script_private = await Script.countDocuments({ visibility: 'private' })
    const script_public = await Script.countDocuments({ visibility: 'public' })
    const script_verified = await Script.countDocuments({ verified: true })

    return respond({
      files: {
        count: file_total,
        single_use: file_total - file_multiple,
        expire_use: file_multiple,
      },
      scripts: {
          count: script_total,
          private: script_private,
          public: script_public,
          verified: script_verified
      }
    })
  })
}
