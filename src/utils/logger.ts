import pino from "pino";
import * as process from "node:process";

// Discord transport for production logging
const transports = [{
    target: "pino-pretty",
    options: {
        colorize: true,
    }
}];



// Modify / Add transports based on environment
// ...

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "trace");
export default pino(pino.transport({targets: transports, level}));