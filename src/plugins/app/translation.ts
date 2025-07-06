import { v2 } from '@google-cloud/translate'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    translation: ReturnType<typeof createTranslationService>
  }
}

function createTranslationService(fastify: FastifyInstance, client: v2.Translate) {
  const services = {
    async translate(text: string, targetLanguage: string) {
      try {
        const [translation] = await client.translate(text, { format: 'text', from: 'ja', to: targetLanguage })
        return translation
      } catch (error) {
        fastify.log.error(error)
        throw new Error('Translation failed')
      }
    },
  }

  return services
}

export default fp(
  async function (fastify) {
    const translateClient = new v2.Translate({ key: fastify.config.GOOGLE_TRANSLATE_API_KEY })

    fastify.decorate('translation', createTranslationService(fastify, translateClient))
  },
  { name: '@KanaKana/translation' },
)
