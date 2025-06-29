import fp from 'fastify-plugin'

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'ApiError'
    Error.captureStackTrace(this, ApiError)
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    error: ReturnType<typeof createApiError>
  }
}

function createApiError() {
  const errs = {
    createError(message: string, statusCode: number) {
      return new ApiError(message, statusCode)
    },
    badRequest(message: string = 'Bad request') {
      return this.createError(message, 400)
    },
    unauthorized(message: string = 'Unauthorized') {
      return this.createError(message, 401)
    },
    forbidden(message: string = 'Forbidden') {
      return this.createError(message, 403)
    },
    notFound(message: string = 'Not found') {
      return this.createError(message, 404)
    },
  }

  return errs
}

export default fp(
  async function (fastify) {
    fastify.decorate('error', createApiError())
  },
  { name: '@KanaKana/api-error' },
)
