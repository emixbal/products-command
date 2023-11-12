import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator"

export const validateAllForm = [
    check('name').isString(),
    check('name').isLength({ min: 2 }),
    check('price').isNumeric(),
    check('price').isLength({ min: 2 }),
    (req: Request, res: Response, next: NextFunction) => {
        const errs = validationResult(req)
        if (!errs.isEmpty()) {
            return res.status(400).json({
                message: errs.array(),
                status: "nok",
                data: null
            })
        }
        return next()
    }
]

