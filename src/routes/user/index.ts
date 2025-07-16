import {Router} from 'express';
import {sendSuccessResponse} from "@src/utils/responses";

const router = Router();

router.get('/', (req, res) => {
    sendSuccessResponse(res, 'Hello from the user API!');
});

export default router;