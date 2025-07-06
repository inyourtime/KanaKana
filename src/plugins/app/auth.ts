import type { FastifyRequest, onRequestAsyncHookHandler } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    verifyApiKey: onRequestAsyncHookHandler
  }

  export interface FastifyContextConfig {
    auth?: boolean
  }
}

export default fp(
  async function (fastify) {
    fastify.decorate('verifyApiKey', verifyApiKey)

    async function verifyApiKey(request: FastifyRequest) {
      const apiKey = request.headers['x-api-key']

      if (!apiKey) {
        throw fastify.error.unauthorized('Missing API key')
      }

      if (apiKey !== fastify.config.API_KEY) {
        throw fastify.error.unauthorized('Invalid API key')
      }

      return
    }
  },
  { name: '@KanaKana/auth' },
)
