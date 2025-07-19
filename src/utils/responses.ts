/// Contains functions for standardized responses in the API
import {Response} from 'express';

/**
 * Sends a response with a message and optional data.
 */
export const sendResponse = (res: Response, code: number, message: string, data?: unknown) => {
    res.status(code).json({
        success: code < 400,
        message,
        data
    });
};

/**
 * Sends a success response with a message and optional data.
 */
export const sendSuccessResponse = (res: Response, message: string, data?: unknown) => {
    sendResponse(res, 200, message, data);
};

/**
 * Sends an error response for a server-side error.
 */
export const sendServerErrorResponse = (res: Response, error: unknown) => {
    sendResponse(res, 500, 'Internal Server Error', error);
};

/**
 * Sends an error response for a client-side error.
 */
export const sendClientErrorResponse = (res: Response, message: string, error?: unknown) => {
    sendResponse(res, 400, message, error);
};