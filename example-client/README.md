# Example client

Example client implementation of the websocket API.

A hosted version of the client is available at http://cash-register-api-example-client.visiolab.io/.

## Running locally

You need [NodeJS 16+](https://nodejs.org/en/)

```bash
npm install
npm run dev
```

A web interface will start on http://localhost:4173/.

### Generating the message types

To generate typescript types for the messages from the AsyncAPI spec, run:

```bash
npm run generateTypes
```
