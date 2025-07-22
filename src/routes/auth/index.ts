import {Router} from 'express';
import signup from "@src/routes/auth/signup";
import login from "@src/routes/auth/login";
import forgot from "@src/routes/auth/forgot";
import reset from "@src/routes/auth/reset";
import webauthn from "@src/routes/auth/webauthn/index";
import token from "@src/routes/auth/token";

const router = Router();

router.get('/', (req, res) => {
    res.success('Hello from the auth API!');
});

router.use("/signup", signup);
router.use("/login", login);
router.use("/forgot", forgot);
router.use("/reset", reset);
router.use("/token", token);

router.use("/webauthn", webauthn);


export default router;