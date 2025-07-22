import {Router} from 'express';
import {z} from "zod";
import {validateData} from "@src/middleware/validateBody";
import logger from "@src/utils/logger";
import * as AccountService from "@src/services/account";

const router = Router();

// Phone number regex (supports various formats)
const phoneRegex = /^[+]?[1-9]\d{0,15}$/;

// Username regex (alphanumeric, underscore, hyphen, 3-30 chars)
const usernameRegex = /^[a-zA-Z0-9_-]{3,32}$/;

//  Login Body Schema
const loginBodySchema = z.object({
    identifier: z.union([
        z.email('Invalid email format'),
        z.string().regex(usernameRegex, 'Username must be 3-30 characters (letters, numbers, underscore, hyphen)'),
        z.string().regex(phoneRegex, 'Invalid phone number format')
    ], {
        error: 'ID must be a valid email, username, or phone number'
    }),
    password: z.string().min(1, 'Password is required'),
});

// Helper function to determine ID type
const getIdType = (id: string) => {
    if (phoneRegex.test(id)) {
        return 'phone';
    } else if (z.email().safeParse(id).success) {
        return 'email';
    } else if (usernameRegex.test(id)) {
        return 'username';
    }
};

router.post('/', validateData(loginBodySchema), async (req, res) => {
    const {identifier, password} = req.body as LoginBody;

    const idType = getIdType(identifier);
    logger.info(`Login attempt with ${idType}`);

    let refreshToken = null;

    // If any errors are thrown, client should receive 401
    res.status(401);

    switch (idType) {
        case "email":
            refreshToken = await AccountService.loginWithEmail(identifier, password);
            break;
        case "username":
            refreshToken = await AccountService.loginWithUsername(identifier, password);
            break;
        case "phone":
            refreshToken = await AccountService.loginWithPhone(identifier, password);
            break;
    }

    res.success(`Refresh token generated successfully`, {refreshToken});
});

export type LoginBody = z.infer<typeof loginBodySchema>;
export default router;