import {Request, Response} from "express";

export function successMiddleware(req: Request, res: Response, next: () => void) {
    res.success = (data: unknown, message: string = "Success", statusCode = 200) => {
        return res.status(statusCode).json({
            message,
            data,
            success: true
        });
    };
    next()
}

export function errorMiddleware(req: Request, res: Response, next: () => void) {
    res.error = (message: string, statusCode = 500) => {
        return res.status(statusCode).json({
            message,
            success: false
        });
    };
    next()
}