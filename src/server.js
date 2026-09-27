import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

const startServer = async () => {
    await connectDatabase();

  const server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });

  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info("HTTP server closed");

      await disconnectDatabase();

      process.exit(0);
    });
  };
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
