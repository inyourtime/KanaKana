import type { FastifyContextConfig, FastifySchema, RegisterOptions } from 'fastify'

export type PresetOption = {
  schema?: FastifySchema
  config?: FastifyContextConfig
}

export type RouteOption = RegisterOptions & {
  preset?: PresetOption
}
