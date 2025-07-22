import {Request, Response} from "express";

export function successMiddleware(req: Request, res: Response, next: () => void) {
    res.success = (message: string = "Success", data: unknown = {}, statusCode = 200) => {
        return res.status(statusCode).json({
            message,
            data,
            success: true
        });
    };
    next();
}

export function errorMiddleware(req: Request, res: Response, next: () => void) {
    res.error = (message: string = "Error", details: unknown = {}, statusCode = 400) => {
        return res.status(statusCode).json({
            message,
            details,
            success: false
        });
    };
    next();
}