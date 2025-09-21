import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  fastify
    .register(AutoLoad, {
      dir: join(__dirname, "plugins"),
      options: Object.assign({ prefix: "/plugins" }, opts),
      dirNameRoutePrefix: false,
      forceESM: true,
    })
    .ready((err) => {
      if (err) throw err;
      fastify.log.info("Plugins loaded");
    });

  fastify
    .register(AutoLoad, {
      dir: join(__dirname, "routes"),
      options: Object.assign({ prefix: "/api" }, opts),
      routeParams: true,
      autoHooks: true,
      cascadeHooks: true,
      forceESM: true,
    })
    .ready((err) => {
      if (err) throw err;
      fastify.log.info("Routes loaded");
    });
};

export default app;
export { app, options };
