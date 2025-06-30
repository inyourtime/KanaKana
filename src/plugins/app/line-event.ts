import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  export interface FastifyInstance {
    lineReply: ReturnType<typeof lineReply>
    processLineEvent: (event: LineEvent) => Promise<void>
  }
}

const YOUTUBE_URL_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
const DEFAULT_GREETING = 'Hello, world!'
const VIDEO_FETCH_ERROR = 'Failed to fetch video title'

// Types
export interface LineEvent {
  type: string
  replyToken: string
  message: {
    text: string
  }
}

export interface LineWebhookBody {
  events: LineEvent[]
}

function extractYouTubeVideoId(text: string): string | null {
  const match = text.match(YOUTUBE_URL_REGEX)
  return match?.[1] || null
}

function lineReply(fastify: FastifyInstance) {
  return async (replyToken: string, text: string) => {
    const res = await fetch(`${fastify.config.LINE_ENDPOINT}/v2/bot/message/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${fastify.config.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text,
          },
        ],
      }),
    })

    if (!res.ok) {
      fastify.log.error('Failed to send line reply', res)
    }
  }
}

export default fp(
  async function (fastify) {
    const _lineReply = lineReply(fastify)

    fastify.decorate('lineReply', _lineReply)
    fastify.decorate('processLineEvent', processLineEvent)

    async function handleYouTubeVideo(videoId: string, replyToken: string): Promise<void> {
      const videoTitle = await fastify.youtube.fetchTitle(videoId)

      if (!videoTitle) {
        await _lineReply(replyToken, VIDEO_FETCH_ERROR)
        return
      }

      const converted = fastify.wanakana.convert(videoTitle)

      const formatLongText = (label: string, text: string, maxLineLength: number = 30) => {
        if (text.length <= maxLineLength) {
          return `${label} ${text}`
        }

        // Break into multiple lines
        const words = text.split(' ')
        const lines = []
        let currentLine = ''

        for (const word of words) {
          if ((currentLine + word).length > maxLineLength && currentLine) {
            lines.push(currentLine.trim())
            currentLine = `${word} `
          } else {
            currentLine += `${word} `
          }
        }

        if (currentLine) {
          lines.push(currentLine.trim())
        }

        return `${label}\n${lines.join('\n')}`
      }

      const response = [
        formatLongText('📺 Original:', converted.original),
        formatLongText('🈴 Kana:', converted.kana),
        formatLongText('🔤 Romaji:', converted.romaji),
      ].join('\n\n')

      await _lineReply(replyToken, response)
    }

    async function handleTextMessage(text: string, replyToken: string): Promise<void> {
      const videoId = extractYouTubeVideoId(text)

      if (videoId) {
        await handleYouTubeVideo(videoId, replyToken)
      } else {
        await _lineReply(replyToken, DEFAULT_GREETING)
      }
    }

    async function processLineEvent(event: LineEvent) {
      switch (event.type) {
        case 'message': {
          const text = event.message?.text

          if (typeof text === 'string') {
            await handleTextMessage(text, event.replyToken)
          }
          break
        }
        default:
          // Handle other event types if needed
          console.log(`Unhandled event type: ${event.type}`)
      }
    }
  },
  { name: '@KanaKana/line-event' },
)
