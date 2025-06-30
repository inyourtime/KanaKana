import fp from 'fastify-plugin'
import fastifyRoutePreset from 'fastify-route-preset'
import type { PresetOption } from '../../types/plugin-type.js'

export default fp(async function (fastify) {
  /**
   * A Fastify plugin for adding route presets.
   *
   * @see {@link https://github.com/inyourtime/fastify-route-preset}
   */
  fastify.register(fastifyRoutePreset, {
    onPresetRoute: (routeOptions, presetOptions: PresetOption) => {
      routeOptions.schema = {
        ...presetOptions.schema,
        ...routeOptions.schema,
      }

      routeOptions.config = {
        ...presetOptions.config,
        ...routeOptions.config,
      }

      if (routeOptions.config.auth === true) {
        const existingOnRequest = routeOptions.onRequest || []
        routeOptions.onRequest = [
          ...(Array.isArray(existingOnRequest) ? existingOnRequest : [existingOnRequest]),
          fastify.verifyApiKey,
        ]

        routeOptions.schema = {
          ...routeOptions.schema,
          security: [{ ApiKeyAuth: [] }],
        }
      }
    },
  })
})
