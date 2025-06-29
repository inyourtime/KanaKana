import { join } from 'node:path'
import fastify, { type FastifyServerOptions } from 'fastify'
import configEnv from './config.js'
import pluginLoader from './plugin-loader.js'
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

  await app.register(pluginLoader, {
    dir: join(import.meta.dirname, 'plugins/external'),
  })

  app.register(pluginLoader, {
    dir: join(import.meta.dirname, 'plugins/app'),
  })

  app.register(schemas)

  app.register(pluginLoader, {
    dir: join(import.meta.dirname, 'routes'),
    routePrefix: '/api/v1',
    indexPattern: /^(.*\.)?route\.(ts|js)$/,
  })

  return app
}
