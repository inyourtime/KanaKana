import { Type } from '@sinclair/typebox'

const TranslationResultSchema = Type.Object(
  {
    original: Type.String(),
    translated: Type.String(),
  },
  { $id: 'TranslationResultSchema', description: 'Translation result' },
)

export { TranslationResultSchema }
