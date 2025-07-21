import {z} from "zod";
import {configDotenv} from "dotenv";
import * as process from "node:process";
import logger from "@src/utils/logger";

configDotenv({
    // can be production or development or test
    path: `.env.${process.env.NODE_ENV}`,
});

// Type-safe environment variables so if any of these are missing, the app will not start
export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),

    PORT: z.coerce.number(),

    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
});

// Custom error handler for better debugging
export default function validateEnv() {
    try {
        envSchema.parse(process.env);
        logger.info('Environment variables validated successfully');
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.error('Environment Configuration Error:');
            error.issues.map(issue => {
                logger.error(`${issue.path.join('.')}: ${issue.message}`);
            });
            logger.error('Please check your .env file and ensure all required variables are set.');

            process.exit(1);
        }
        throw error;
    }
}