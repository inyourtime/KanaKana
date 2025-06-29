import fp from 'fastify-plugin'

export default fp(
  async function (fastify) {
    // fastify.setErrorHandler((error, _request, reply) => {
    //   console.log(error)
    //   reply.status(error.statusCode || 500).send({ error: error.message })
    // })

    fastify.setNotFoundHandler(
      {
        preHandler: fastify.rateLimit({
          max: 3,
          timeWindow: 500,
        }),
      },
      (req, reply) => {
        req.log.warn(
          {
            request: {
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
            },
          },
          'Resource not found',
        )

        reply.code(404).send({
          error: 'Not Found',
          message: `Route ${req.method}:${req.url} not found`,
        })
      },
    )
  },
  { name: '@KanaKana/error-handler' },
)
