import { z } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidationSchema = {
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
};

export const validate = ({ body, params, query }: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
        if (body) {
            const result = body.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: result.error.errors,
                });
            }
            req.body = result.data;
        }

        if (params) {
            const result = params.safeParse(req.params);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: result.error.errors,
                });
            }
            req.params = result.data;
        }

        if (query) {
            const result = query.safeParse(req.query);
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: result.error.errors,
                });
            }
            req.query = result.data;
        }

        next();

        return undefined;
    };
};
