import app from "./app";
import * as process from "node:process";
import validateEnv from "@src/utils/env";
import {initDatabase} from "@src/db/database";
import logger from "./utils/logger";

// Validate environment variables before starting the server
validateEnv();

// Initialize the database connection
initDatabase();

// Start the server
app.listen(process.env.PORT, () => {
    logger.info(`Server is listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
    logger.info(`http://localhost:${process.env.PORT}`);
});