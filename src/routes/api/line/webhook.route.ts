import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { LineWebhookBody } from '../../../plugins/app/line-event.js'
import type { RouteOption } from '../../../types/plugin-type.js'

export const options: RouteOption = {
  prefix: '/line-webhook',
  preset: {
    schema: { hide: true },
  },
}

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/',
    {
      preParsing: fastify.parseRawBody,
      preHandler: fastify.verifyLineSignature,
    },
    async (request, _reply) => {
      try {
        const { events } = request.body as LineWebhookBody

        if (!events || !Array.isArray(events)) {
          return 'OK' // LINE expects 200 even for malformed requests
        }

        // Process events concurrently for better performance
        await Promise.allSettled(events.map((event) => fastify.processLineEvent(event)))

        return 'OK'
      } catch (error) {
        fastify.log.error('Error processing LINE webhook:', error)
        // Still return OK to prevent LINE from retrying
        return 'OK'
      }
    },
  )
}

export default route
