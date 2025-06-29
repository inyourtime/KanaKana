import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { RouteOption } from '../../types/plugin-type.js'

export const options: RouteOption = {
  preset: {
    schema: { hide: true },
  },
}

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/', (_req, reply) => {
    // Redirect to Documentation
    reply.redirect('/api/v1/docs', 301)
  })

  fastify.get('/healthz', (_req, reply) => {
    reply.send({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
    })
  })
}

export default route
