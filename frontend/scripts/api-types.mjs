import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import SwaggerParser from '@apidevtools/swagger-parser'
import openapiTS, { astToString } from 'openapi-typescript'

const contract = new URL('../../contracts/openapi.yaml', import.meta.url)
const output = new URL('../src/api/schema.d.ts', import.meta.url)
await SwaggerParser.validate(fileURLToPath(contract))
const generated = astToString(await openapiTS(contract))
if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8')
  if (current !== generated) {
    throw new Error('API types are outdated. Run pnpm api:generate and commit the result.')
  }
  console.log('OpenAPI and generated types are consistent.')
} else {
  await writeFile(output, generated)
  console.log('Generated src/api/schema.d.ts from contracts/openapi.yaml.')
}
