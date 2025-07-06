import fastifyLine from 'fastify-line'
import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  /**
   * A Fastify plugin for LINE Messaging API integration.
   *
   * @see {@link https://github.com/inyourtime/fastify-line}
   */
  fastify.register(fastifyLine, {
    channelSecret: fastify.config.LINE_CHANNEL_SECRET,
    channelAccessToken: fastify.config.LINE_CHANNEL_ACCESS_TOKEN,
  })
})
