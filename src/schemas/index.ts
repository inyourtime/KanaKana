import fp from 'fastify-plugin'
import { ApiErrorSchema } from './error.js'
import { TranslationResultSchema } from './translate.js'

export default fp(
  async function (fastify) {
    fastify.addSchema(TranslationResultSchema)
    fastify.addSchema(ApiErrorSchema)
  },
  { name: '@KanaKana/schema' },
)
