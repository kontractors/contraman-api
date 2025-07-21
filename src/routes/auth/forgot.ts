import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
    // TODO: Implement signup logic
    res.success( 'Password reset link sent');
});

export default router;