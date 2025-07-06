import { type FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { ApiErrorSchema } from '../../../schemas/error.js'
import { UnsafeRef } from '../../../schemas/generic.js'
import { TranslationResultSchema } from '../../../schemas/translate.js'
import type { RouteOption } from '../../../types/plugin-type.js'

export const autoConfig: RouteOption = {
  preset: {
    schema: {
      tags: ['Japanese Translation'],
    },
    config: {
      auth: true,
    },
  },
}

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  const { youtube, translation } = fastify

  fastify.get(
    '/',
    {
      schema: {
        summary: 'Translate Japanese YouTube video title to English',
        description: 'Accepts a YouTube video URL and returns the video title translated to English.',
        querystring: Type.Object({
          youtube_url: Type.String({ minLength: 1, examples: ['https://youtu.be/F3P8vcZkIh4?si=PVoj2joUgfRdbQuH'] }),
        }),
        response: {
          200: UnsafeRef(TranslationResultSchema),
          400: UnsafeRef(ApiErrorSchema, { description: 'Bad Request' }),
        },
      },
    },
    async (req) => {
      const { youtube_url } = req.query
      const videoId = youtube.extractYouTubeVideoId(youtube_url)
      if (!videoId) {
        throw fastify.error.badRequest('Invalid YouTube URL')
      }

      const videoTitle = await youtube.fetchTitle(videoId)

      if (!videoTitle) {
        throw fastify.error.badRequest('Failed to fetch video title')
      }

      const translatedTitle = await translation.translate(videoTitle, 'en')

      return {
        original: videoTitle,
        translated: translatedTitle,
      }
    },
  )

  fastify.post(
    '/text',
    {
      schema: {
        summary: 'Translate Japanese text to English',
        description: `Accepts a text string in Japanese and returns the translated text in English.`,
        body: Type.Object({
          text: Type.String({
            minLength: 1,
            examples: [
              '酸欠少女さユりxMY FIRST STORY『レイメイ』MV(フルver)TVアニメ『ゴールデンカムイ』第二期OPテーマ',
            ],
          }),
        }),
        response: {
          200: UnsafeRef(TranslationResultSchema),
        },
      },
    },
    async (req) => {
      const { text } = req.body

      const translatedText = await translation.translate(text, 'en')

      return {
        original: text,
        translated: translatedText,
      }
    },
  )
}

export default route
