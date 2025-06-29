import fastifyHelmet from '@fastify/helmet'
import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  /**
   * A Fastify plugin for adding HTTP headers to help protect your app from well-known web vulnerabilities
   *
   * @see {@link https://github.com/fastify/fastify-helmet}
   */
  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'"],
      },
    },
  })
})
