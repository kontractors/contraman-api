import {Router} from 'express';
import auth from "@src/routes/auth";
import business from "@src/routes/business";
import user from "@src/routes/user";
import {sendSuccessResponse} from "@src/utils/responses";

const router = Router();

router.get('/', (req, res) => {
    sendSuccessResponse(res, 'Hello from the API!');
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/business', business);

export default router;