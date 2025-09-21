import { FastifyInstance, FastifyServerOptions, fastify } from "fastify";

type Fastify = typeof fastify;
async function createServerApp(fastify: Fastify, opts: FastifyServerOptions) {
  const app: FastifyInstance = fastify(opts);
  app.register(import("./app")).ready((err) => {
    if (err) throw err;
    app.log.info("Server is ready");
  });
  return app;
}

const app = await createServerApp(fastify, {
  logger: true,
});

const port = process.env.SERVER_PORT || "3000";
const host = process.env.SERVER_HOST || "localhost";

app.listen({ host, port: parseInt(port) }, (err: Error | null) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
