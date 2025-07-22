import {Router} from 'express';
import {z} from "zod";
import {validateData} from "@src/middleware/validateBody";
import {createNewUser} from "@src/services/user";

const router = Router();

const SignupBodySchema = z.object({
    email: z.email(),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

router.post('/', validateData(SignupBodySchema), async (req, res) => {
    try {
        const refreshToken = await createNewUser(req.body.email, req.body.username, req.body.password);
        res.success('Account created successfully. Use this refresh token to retrieve an access-token from the /auth/token endpoint.', {refreshToken}, 201);
    } catch (error) {
        res.error('Error creating account creation', error.message);
    }
});

export type SignupBody = z.infer<typeof SignupBodySchema>;
export default router;