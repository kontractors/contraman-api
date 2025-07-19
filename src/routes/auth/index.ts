import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.success('Hello from the auth API!');
});

export default router;