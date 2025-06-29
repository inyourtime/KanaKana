import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import fp from 'fastify-plugin'

type LoaderOptions = {
  /** Directory to scan for plugin files */
  dir: string
  /** Optional prefix to prepend to all plugin routes */
  routePrefix?: string
  /** Optional index pattern to match plugin files */
  indexPattern?: RegExp
}

/**
 * Recursively scans a directory tree and returns all TypeScript/JavaScript files
 *
 * @param dir - The directory path to scan
 * @returns Promise resolving to an array of file paths
 */
async function buildFileTree(dir: string, indexPattern?: RegExp) {
  const files: string[] = []

  const dirEntries = await readdir(dir, { withFileTypes: true })

  for (const entry of dirEntries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      const subFiles = await buildFileTree(fullPath)
      files.push(...subFiles)
    } else if (entry.isFile() && isValidPluginFile(entry.name, indexPattern)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Checks if a filename represents a valid plugin file
 *
 * @param filename - The filename to check
 * @returns True if the file has a valid extension (.ts or .js)
 */
function isValidPluginFile(filename: string, indexPattern?: RegExp) {
  if (indexPattern) {
    return indexPattern.test(filename)
  }

  return filename.endsWith('.ts') || filename.endsWith('.js')
}

/**
 * Constructs the final route prefix by combining loader and plugin prefixes
 *
 * @param loaderPrefix - Prefix from loader options
 * @param pluginPrefix - Prefix from plugin options
 * @returns Combined prefix string or undefined if neither exists
 */
function buildRoutePrefix(loaderPrefix?: string, pluginPrefix?: string) {
  if (!loaderPrefix && !pluginPrefix) {
    return undefined
  }

  if (loaderPrefix && pluginPrefix) {
    const cleanLoaderPrefix = loaderPrefix.replace(/\/$/, '')
    const cleanPluginPrefix = pluginPrefix.replace(/^\//, '')
    return `${cleanLoaderPrefix}/${cleanPluginPrefix}`
  }

  return loaderPrefix || pluginPrefix
}

export default fp<LoaderOptions>(
  async function pluginLoader(fastify, opts) {
    const files = await buildFileTree(opts.dir, opts.indexPattern)

    // Load all plugins sequentially to maintain registration order
    for (const file of files) {
      const fileExports = await import(file)

      // Skip files that explicitly disable autoloading
      if (fileExports.autoload === false) return

      const pluginOptions = { ...fileExports.options }
      const finalPrefix = buildRoutePrefix(opts.routePrefix, pluginOptions.prefix)

      pluginOptions.prefix = finalPrefix

      fastify.register(fileExports.default, pluginOptions)
    }
  },
  { name: '@KanaKana/plugin-loader' },
)
