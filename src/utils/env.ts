import {z} from "zod";
import {configDotenv} from "dotenv";
import * as process from "node:process";
import * as console from "node:console";

configDotenv();

// Type-safe environment variables so if any of these are missing, the app will not start
export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),

    PORT: z.coerce.number(),

    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
});

// Custom error handler for better debugging
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('🚨 Environment Configuration Error:');
            error.issues.map(issue => {
                console.error(`❌ ${issue.path.join('.')}: ${issue.message}`);
            });
            console.error('\n💡 Please check your .env file and ensure all required variables are set.');

            process.exit(1);
        }
        throw error;
    }
}

export const env = validateEnv();