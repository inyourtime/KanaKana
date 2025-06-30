import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    youtube: ReturnType<typeof createYoutubeService>
  }
}

type GoogleApiResponse = {
  items: {
    snippet: {
      title: string
    }
  }[]
}

function createYoutubeService({ config, log }: FastifyInstance) {
  const services = {
    async fetchTitle(videoId: string) {
      const apiKey = config.YOUTUBE_API_KEY
      const apiUrl = `${config.GOOGLE_API_URL}/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`

      const response = await fetch(apiUrl)
      const data = (await response.json()) as GoogleApiResponse
      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.title
      }

      log.error(JSON.stringify(data))

      return null
    },
  }

  return services
}

export default fp(
  async function (fastify) {
    fastify.decorate('youtube', createYoutubeService(fastify))
  },
  { name: '@KanaKana/youtube' },
)
