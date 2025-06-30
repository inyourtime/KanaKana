import crypto from 'node:crypto'
import type { preHandlerAsyncHookHandler, preParsingHookHandler } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    verifyLineSignature: preHandlerAsyncHookHandler
    parseRawBody: preParsingHookHandler
  }

  export interface FastifyRequest {
    rawBody: string
  }
}

export default fp(
  async function (fastify) {
    const verifyLineSignature: preHandlerAsyncHookHandler = async (request, _reply) => {
      const signature = request.headers['x-line-signature']
      if (!signature) {
        throw fastify.error.unauthorized('Missing signature header')
      }

      const computedSignature = crypto
        .createHmac('SHA256', fastify.config.LINE_CHANNEL_SECRET)
        .update(request.rawBody)
        .digest('base64')

      if (signature !== computedSignature) {
        throw fastify.error.unauthorized('Invalid signature')
      }

      return
    }

    const parseRawBody: preParsingHookHandler = (request, _reply, payload, done) => {
      let data = ''

      payload.on('data', (chunk: string) => {
        data += chunk
      })

      payload.on('end', () => {
        request.rawBody = data
      })

      done(null, payload)
    }

    fastify.decorate('verifyLineSignature', verifyLineSignature)
    fastify.decorate('parseRawBody', parseRawBody)
  },
  { name: '@KanaKana/verify-line-signature' },
)
