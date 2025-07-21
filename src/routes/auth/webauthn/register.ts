import {Router} from 'express';

const router = Router();

// Begins the WebAuthn registration process by returning the options to the client
// The options will be used by the client to create a new credential
router.get('/', (req, res) => {
    // TODO: Implement logic to return WebAuthn options
    res.success('WebAuthn registration options retrieved successfully');
})

// Once the client has created a new credential, it will send the response back to the server
// This endpoint will verify the response and store the new credential (public key) in the database
router.post('/', (req, res) => {
    // TODO: Implement logic to verify WebAuthn options
    res.success('WebAuthn registration options verified successfully');
})


export default router;