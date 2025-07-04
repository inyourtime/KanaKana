import ytdl from '@distube/ytdl-core'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    ytdl: ReturnType<typeof createYtdlService>
  }
}

function createYtdlService(_fastify: FastifyInstance) {
  const services = {
    async getTitle(url: string) {
      try {
        const info = await ytdl.getBasicInfo(url)
        return info.videoDetails.title
      } catch {
        return null
      }
    },
  }

  return services
}

export default fp(
  async function (fastify) {
    fastify.decorate('ytdl', createYtdlService(fastify))
  },
  { name: '@KanaKana/ytdl' },
)
