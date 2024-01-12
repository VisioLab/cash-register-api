

import * as fs from "fs/promises"
import parser from '@asyncapi/parser';
import { compile } from 'json-schema-to-typescript'


const main = async (): Promise<void> => {
    const asyncApiDocument = await fs.readFile("../api.yml")
    const parsedDoc = await parser.parse(asyncApiDocument.toString());
    const types = await Promise.all(
        [...parsedDoc.allMessages().entries()]
            .map(([name, message]) =>
                compile(message.json().payload, name, { bannerComment: "", additionalProperties: false }))
            .concat([...parsedDoc.allSchemas().entries()]
                .filter(([name]) => !name.startsWith("<anonymous"))
                .map(([name, message]) =>
                    compile(message.json(), name, { bannerComment: "", additionalProperties: false })))

    )
    await fs.writeFile("./src/types.ts", types.join("\n"))
}

main().then(() => console.log('Done'));