import {Router} from 'express';
import auth from "@src/routes/auth";
import business from "@src/routes/business";
import user from "@src/routes/user";
import {env} from "@src/utils/env";

const router = Router();

router.get('/', (req, res) => {
    res.success(`Hello from the ${env.NODE_ENV} API!`);
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/business', business);

export default router;