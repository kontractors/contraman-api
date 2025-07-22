import {Router} from 'express';
import {z} from "zod";
import {validateData} from "@src/middleware/validateBody";
import {createAccessToken} from "@src/services/account";

const router = Router();

const TokenBodySchema = z.object({
    refreshToken: z.string().min(128)
});

router.post('/', validateData(TokenBodySchema), async (req, res) => {
    const {refreshToken} = req.body as TokenBody;

    // Any errors returned to client should be 401 for this endpoint
    res.status(401);

    const accessToken = await createAccessToken(refreshToken);
    res.success('Access token generated successfully', {accessToken}, 200);
});

export type TokenBody = z.infer<typeof TokenBodySchema>;
export default router;