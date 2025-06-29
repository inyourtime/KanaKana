import build from './app.js'

const server = await build()

await server.ready()

try {
  await server.listen({
    host: server.config.HOST,
    port: server.config.PORT,
    listenTextResolver: (address) => `KanaKana listening on ${address}`,
  })
} catch (error) {
  server.log.error(error)
  process.exit(1)
}
