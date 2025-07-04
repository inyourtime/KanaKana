import { type FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { JapaneseConversionResultSchema } from '../../../schemas/convert.js'
import { ApiErrorSchema } from '../../../schemas/error.js'
import { UnsafeRef } from '../../../schemas/generic.js'
import type { RouteOption } from '../../../types/plugin-type.js'

export const options: RouteOption = {
  prefix: '/convert-japanese',
  preset: {
    schema: {
      tags: ['Japanese Conversion'],
    },
  },
}

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  const { ytdl, wanakana } = fastify

  fastify.get(
    '/',
    {
      schema: {
        summary: 'Convert Japanese YouTube video title to Kana and Romaji',
        description:
          'This endpoint accepts a YouTube URL, extracts the video title (assumed to be in Japanese), and returns the original text along with its Kana and Romaji transliterations.',
        querystring: Type.Object({
          youtube_url: Type.String({ minLength: 1, examples: ['https://youtu.be/F3P8vcZkIh4?si=PVoj2joUgfRdbQuH'] }),
        }),
        response: {
          200: UnsafeRef(JapaneseConversionResultSchema),
          400: UnsafeRef(ApiErrorSchema, { description: 'Bad Request' }),
        },
      },
    },
    async (req) => {
      const videoTitle = await ytdl.getTitle(req.query.youtube_url)

      if (!videoTitle) {
        throw fastify.error.badRequest('Invalid YouTube URL')
      }

      return wanakana.convert(videoTitle)
    },
  )

  fastify.post(
    '/text',
    {
      schema: {
        summary: 'Convert Japanese text to Kana and Romaji',
        description: `Accepts a Japanese text string and returns its Kana and Romaji transliterations.`,
        body: Type.Object({
          text: Type.String({
            minLength: 1,
            examples: ['=LOVE (イコールラブ）/ 18th Single『とくべチュ、して』【MV full】'],
          }),
        }),
        response: {
          200: UnsafeRef(JapaneseConversionResultSchema),
        },
      },
    },
    (req) => {
      return wanakana.convert(req.body.text)
    },
  )
}

export default route
