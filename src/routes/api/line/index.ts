import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { WebhookRequestBody } from 'fastify-line'

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/webhook',
    {
      schema: { hide: true },
      config: { lineWebhook: true },
    },
    async (request, _reply) => {
      try {
        const { events } = request.body as WebhookRequestBody

        if (!events || !Array.isArray(events)) {
          return 'OK'
        }

        await Promise.all(
          events.map(async (event) => {
            if (event.type === 'message' && event.message.type === 'text') {
              const { text } = event.message

              if (text.startsWith('tr') || text.startsWith('Tr') || text.startsWith('TR')) {
                // Handle translation request
                const translatedText = await fastify.translation.translate(text.slice(2).trim(), 'en')

                await fastify.line.replyMessage({
                  replyToken: event.replyToken,
                  messages: [{ type: 'text', text: translatedText }],
                })
                return
              }

              const videoId = fastify.youtube.extractYouTubeVideoId(text)

              if (!videoId) {
                await fastify.line.replyMessage({
                  replyToken: event.replyToken,
                  messages: [{ type: 'text', text: 'Please provide a valid YouTube video URL.' }],
                })
                return
              }

              const videoTitle = await fastify.youtube.fetchTitle(videoId)
              if (!videoTitle) {
                await fastify.line.replyMessage({
                  replyToken: event.replyToken,
                  messages: [{ type: 'text', text: 'Failed to fetch video title.' }],
                })
                return
              }

              const translatedText = await fastify.translation.translate(videoTitle, 'en')

              await fastify.line.replyMessage({
                replyToken: event.replyToken,
                messages: [
                  { type: 'text', text: videoTitle },
                  { type: 'text', text: translatedText },
                ],
              })
            }
          }),
        )

        return 'OK'
      } catch (error) {
        fastify.log.error('Error processing LINE webhook:', error)
        // Still return OK to prevent LINE from retrying
        return 'OK'
      }
    },
  )
}

export default route
