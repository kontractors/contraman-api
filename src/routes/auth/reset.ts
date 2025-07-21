import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    // TODO: Implement signup logic
    res.success('If that email address is in our database, we will send you an email to reset your password.');
});

export default router;