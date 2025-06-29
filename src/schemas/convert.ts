import { Type } from '@sinclair/typebox'

const JapaneseConversionResultSchema = Type.Object(
  {
    original: Type.String(),
    kana: Type.String(),
    romaji: Type.String(),
  },
  { $id: 'JapaneseConversionResultSchema', description: 'Japanese Conversion Result' },
)

export { JapaneseConversionResultSchema }
