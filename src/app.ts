import { join } from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import fastify, { type FastifyServerOptions } from 'fastify'
import configEnv from './config.js'
import schemas from './schemas/index.js'

const serverOptions: FastifyServerOptions = {
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all',
    },
  },
  logger: {
    mixin() {
      return {
        service: 'kanakana',
      }
    },
  },
}

export default async function build(opts?: FastifyServerOptions) {
  const app = fastify({ ...serverOptions, ...opts })

  await app.register(configEnv)

  await app.register(fastifyAutoload, {
    dir: join(import.meta.dirname, 'plugins/external'),
  })

  app.register(fastifyAutoload, {
    dir: join(import.meta.dirname, 'plugins/app'),
  })

  app.register(schemas)

  app.register(fastifyAutoload, {
    dir: join(import.meta.dirname, 'routes'),
  })

  return app
}
