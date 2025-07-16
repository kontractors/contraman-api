import {z} from "zod";
import {configDotenv} from "dotenv";
import * as process from "node:process";

configDotenv();

// Type-safe environment variables so if any of these are missing, the app will not start
export const env = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),

    PORT: z.coerce.number(),

    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
}).parse(process.env);