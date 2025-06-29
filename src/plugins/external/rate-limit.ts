import fastifyRateLimit from '@fastify/rate-limit'
import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  /**
   * A Fastify plugin for rate limiting
   *
   * @see {@link https://github.com/fastify/fastify-rate-limit}
   */
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
})
