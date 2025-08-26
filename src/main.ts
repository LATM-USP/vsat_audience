import createApp from "./createApp.js";

createApp()
  .then(([startServer, log]) =>
    startServer()
      .then(({ config }) => {
        log.info("Server listening on port %d", config.port);
      })
      .catch((err) => {
        log.error({ err }, "Error starting server");
        process.exit(1);
      }),
  )
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });
