import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.success('Hello from the user API!');
});

export default router;