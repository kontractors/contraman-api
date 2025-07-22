import {z, ZodError} from "zod";
import {$ZodIssue} from "zod/v4/core";
import {NextFunction, Request, Response} from "express";

export function validateData(schema: z.ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue: $ZodIssue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.error('Invalid data', errorMessages);
            } else {
                throw error;
            }
        }
    };
}