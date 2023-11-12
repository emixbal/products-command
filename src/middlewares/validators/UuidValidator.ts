import { Request, Response, NextFunction } from "express";
import { validate } from 'uuid';

export const validateUUID = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    if (!validate(id)) {
        res.status(400).json({
            status: "error",
            message: "Invalid UUID format",
            data: null
        });
        return;
    }
    next();
};
