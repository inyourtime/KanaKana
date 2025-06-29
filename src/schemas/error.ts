import { Type } from '@sinclair/typebox'

const ApiErrorSchema = Type.Object(
  {
    message: Type.String(),
    statusCode: Type.Number(),
    error: Type.String(),
  },
  { $id: 'ApiErrorSchema' },
)

export { ApiErrorSchema }
