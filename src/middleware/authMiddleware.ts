// export default (req, res, next) => {
//     // Check if the request has a valid authentication token
//     const token = req.headers['authorization']?.split(' ')[1];
//
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//
//     // Here you would typically verify the token (e.g., using JWT)
//     // For simplicity, let's assume the token is valid
//     // In a real application, you would replace this with actual verification logic
//
//     next(); // Proceed to the next middleware or route handler
// };