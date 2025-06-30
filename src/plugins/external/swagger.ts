import fastifySwagger from '@fastify/swagger'
import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  const docV1Url = '/api/v1/docs'

  /**
   * A Fastify plugin for serving Swagger (OpenAPI v2) or OpenAPI v3 schemas
   *
   * @see {@link https://github.com/fastify/fastify-swagger}
   */
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'KanaKana API',
        description: 'Your Japanese Text Buddy.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-api-key',
            description: 'API key for authentication',
          },
        },
      },
    },
  })

  fastify.register(
    async function (fastify) {
      fastify.get('/', (_request, reply) => {
        reply.type('text/html').send(apiReferenceHtml(`${docV1Url}/json`))
      })

      fastify.get('/json', (_request, reply) => {
        reply.send(fastify.swagger())
      })
    },
    { prefix: docV1Url, preset: { schema: { hide: true } } },
  )
})

const apiReferenceHtml = (url: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>

  <body>
    <div id="app"></div>

    <!-- Load the Script -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>

    <!-- Initialize the Scalar API Reference -->
    <script>
      Scalar.createApiReference("#app", {
        // The URL of the OpenAPI/Swagger document
        url: "${url}",
      });
    </script>
  </body>
</html>
`
