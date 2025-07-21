import {Router} from 'express';

const router = Router();

// When the client wants to authenticate with WebAuthn, it will send a request to this endpoint
// This will generate a challenge and return the options to the client
router.get('/', (req, res) => {
    // TODO: Implement logic to return WebAuthn challenge associated with the user
    res.success('WebAuthn authentication options retrieved successfully');
})

// The client will send the public key credential response back to the server
// This endpoint will verify the response and authenticate the user
router.post('/', (req, res) => {
    // TODO: Implement logic to verify the received WebAuthn credential (public key) by comparing it with the stored credentials in the database
    res.success('WebAuthn authentication options verified successfully');
})


export default router;