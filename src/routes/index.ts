import {Router} from 'express';
import auth from "@src/routes/auth";
import business from "@src/routes/business";
import user from "@src/routes/user";
import * as process from "node:process";

const router = Router();

router.get('/', (req, res) => {
    res.success(`Hello from the ${process.env.NODE_ENV} API!`);
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/business', business);

export default router;