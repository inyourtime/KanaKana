import ytdl from '@distube/ytdl-core'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    ytdl: ReturnType<typeof createYtdlService>
  }
}

function createYtdlService(fastify: FastifyInstance) {
  const services = {
    async getTitle(url: string) {
      try {
        const agent = ytdl.createAgent([
          { name: 'VISITOR_INFO1_LIVE', value: 'some_value' },
          { name: 'CONSENT', value: 'YES+1' },
        ])

        const info = await ytdl.getBasicInfo(url, {
          agent,
          requestOptions: {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
          },
        })
        return info.videoDetails.title
      } catch (error) {
        console.log(error)
        fastify.log.error(error)
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
