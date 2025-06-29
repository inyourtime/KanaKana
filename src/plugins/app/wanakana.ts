import fp from 'fastify-plugin'
import { isJapanese, isKana, isKanji, isMixed, isRomaji, toKana, toRomaji } from 'wanakana'

declare module 'fastify' {
  export interface FastifyInstance {
    wanakana: ReturnType<typeof createWanakana>
  }
}

function createWanakana() {
  const services = {
    toKana(text: string) {
      return toKana(text)
    },
    toRomaji(text: string) {
      return toRomaji(text)
    },
    isJapanese(text: string) {
      return isJapanese(text) || isMixed(text) || isKanji(text) || isRomaji(text) || isKana(text)
    },
    convert(text: string) {
      if (!this.isJapanese(text)) {
        return {
          original: text,
          kana: '',
          romaji: '',
        }
      }

      return {
        original: text,
        kana: this.toKana(text),
        romaji: this.toRomaji(text),
      }
    },
  }

  return services
}

export default fp(
  async function (fastify) {
    fastify.decorate('wanakana', createWanakana())
  },
  { name: '@KanaKana/wanakana' },
)
