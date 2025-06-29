import fastifyCors from '@fastify/cors'
import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  /**
   * A Fastify plugin for CORS
   *
   * @see {@link https://github.com/fastify/fastify-cors}
   */
  fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
})
