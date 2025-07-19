import express, {NextFunction, Request, Response} from "express";
import {env} from "@src/utils/env";
import logger from "pino-http";
import router from "@src/routes";
import {errorMiddleware, successMiddleware} from "@src/utils/responses";

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

// Provides res.success and res.error methods
api.use(successMiddleware)
api.use(errorMiddleware);

// Start serving our route
api.use(router);

// Global uncaught error handling middleware
// Needs 4 parameters to be recognized as an error handler by Express therefore using eslint-disable comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
api.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    req.log.error(err, "An uncaught error occurred");
    res.status(500).json({
        msg: err.message,
        success: false,
    });
});

api.listen(env.PORT, () => {
    console.log(`Server is listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`http://localhost:${env.PORT}`);
});