import * as fs from "fs/promises"
import { Parser } from '@asyncapi/parser'
import { compile } from 'json-schema-to-typescript'

const asyncApiDocument = await fs.readFile("../api.yml")
const parser = new Parser()
const { document, diagnostics } = await parser.parse(asyncApiDocument.toString())

if (!document) {
    console.error("Failed to parse AsyncAPI document:")
    for (const d of diagnostics) {
        if (d.severity === 0) {
            console.error(`  ${d.message} (${d.path.join(".")})`)
        }
    }
    process.exit(1)
}

const toMessageTypeName = (id: string): string =>
    `${id.charAt(0).toUpperCase()}${id.slice(1)}`

const messageTypes = await Promise.all(
    document.allMessages().all()
        .map((message) =>
            compile(message.payload()?.json() ?? {}, toMessageTypeName(message.id()), { bannerComment: "", additionalProperties: false }))
)

const schemaTypes = await Promise.all(
    document.allSchemas().all()
        .filter((schema) => !schema.id().startsWith("<anonymous"))
        .map((schema) =>
            compile(schema.json(), schema.id(), { bannerComment: "", additionalProperties: false }))
)

await fs.writeFile("./src/types.ts", messageTypes.concat(schemaTypes).join("\n"))
