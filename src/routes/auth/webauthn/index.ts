import {Router} from 'express';
import register from "@src/routes/auth/webauthn/register";
import authenticate from "@src/routes/auth/webauthn/authenticate";

const router = Router();

router.get('/', (req, res) => {
    res.success('Hello from the WebAuthn API!');
});

router.use(register);
router.use(authenticate);

export default router;