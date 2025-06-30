import { type Static, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    config: Static<typeof schema>
  }
}

const schema = Type.Object({
  PORT: Type.Number({ default: 5000 }),
  HOST: Type.String({ default: '0.0.0.0' }),
  YOUTUBE_API_KEY: Type.String(),
  GOOGLE_API_URL: Type.String({ default: 'https://www.googleapis.com' }),
  LINE_CHANNEL_SECRET: Type.String(),
  LINE_CHANNEL_ACCESS_TOKEN: Type.String(),
  LINE_ENDPOINT: Type.String({ default: 'https://api.line.me' }),
  API_KEY: Type.String(),
})

export default fp(
  async function (fastify) {
    const config = Value.Parse(schema, process.env)

    fastify.decorate('config', config)
  },
  {
    name: '@KanaKana/config',
  },
)
