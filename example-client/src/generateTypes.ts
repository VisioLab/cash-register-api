

import { TypeScriptGenerator } from "@asyncapi/modelina"
import * as fs from "fs/promises"
const generator = new TypeScriptGenerator({ modelType: 'interface' });
import parser from '@asyncapi/parser';
import { compile } from 'json-schema-to-typescript'


const main = async (): Promise<void> => {
    const asyncApiDocument = await fs.readFile("../websocket/api.yml")
    // console.log(asyncApiDocument.toString())
    const parsedDoc = await parser.parse(asyncApiDocument.toString());
    // console.log(parsedDoc.allMessages())
    const types = await Promise.all(
        [...parsedDoc.allMessages().entries()].map(([name, message]) =>
            compile(message.json().payload as any, name, { bannerComment: "", additionalProperties: false }))
    )
    await fs.writeFile("./src/types.ts", types.join("\n"))
}

main().then(() => console.log('Done'));