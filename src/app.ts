// Create the API app
import express, {NextFunction, Request, Response} from "express";
import logger from "@src/utils/logger";
import * as process from "node:process";
import {errorMiddleware, successMiddleware} from "@src/middleware/responses";
import router from "@src/routes/index";
import {pinoHttp} from "pino-http";

const app = express();
app.disable('x-powered-by'); // Disable the x-powered-by header to prevent security leaks

// Enable request logging using pino-http
app.use(pinoHttp({
    logger
}));

// Enable JSON body parsing
app.use(express.json({
    limit: "100kb" // Set a limit for the JSON body size
}));

// Provides res.success and res.error methods
app.use(successMiddleware);
app.use(errorMiddleware);

// Start serving our route
app.use(router);

// Global uncaught error handling middleware
// Needs 4 parameters to be recognized as an error handler by Express therefore using eslint-disable comment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    req.log.error(err, "An uncaught error occurred");
    const data = process.env.NODE_ENV === "production" ? {} : err;
    const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    
    res.error(err.message, data, statusCode);
});

export default app;