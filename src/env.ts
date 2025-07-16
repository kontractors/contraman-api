import {z} from "zod";

// Type-safe environment variables so if any of these are missing, the app will not start
export const env = z.object({
    PORT: z.coerce.number(),
    DB_HOST: z.url(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
}).parse(process.env);