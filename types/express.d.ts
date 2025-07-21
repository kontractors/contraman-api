declare global {
    namespace Express {
        interface Response {
            // Send a success response with data, optional message, and optional status code
            success: (message: string, data?: unknown, statusCode?: number) => Response;
            // Send an error response with a message and optional status code
            error: (message: string, details?: unknown, statusCode?: number) => Response;
        }
    }
}

export {}