import express from "express";
import {env} from "@src/utils/env";
import logger from "pino-http";
import router from "@src/routes";

// Create the API app
const api = express();
api.disable('x-powered-by'); // Disable the x-powered-by header to prevent security leaks

// Enable request logging using pino-http
api.use(logger({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true
        }
    }
}));

// Enable JSON body parsing
api.use(express.json({
    limit: "100kb" // Set a limit for the JSON body size
}));

// Start serving our routes
api.use(router);

api.listen(env.PORT, () => {
    console.log(`Server is listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`http://localhost:${env.PORT}`);
});