import fp from 'fastify-plugin'
import { JapaneseConversionResultSchema } from './convert.js'
import { ApiErrorSchema } from './error.js'

export default fp(
  async function (fastify) {
    fastify.addSchema(JapaneseConversionResultSchema)
    fastify.addSchema(ApiErrorSchema)
  },
  { name: '@KanaKana/schema' },
)
