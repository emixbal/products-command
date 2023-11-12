import { Request, Response, NextFunction } from "express";
import { check, oneOf, validationResult } from "express-validator"

export const validateRegister = [
    check('password').isString(),
    check('password').isLength({ min: 8 }),
    check('username').isString(),
    check('username').isLength({ min: 4 }),
    check('email').isEmail(),
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

export const validateLogin = [
    oneOf([
        check('username')
            .exists()
            .withMessage('username is required')
            .withMessage('wrong username length'),

        check('email')
            .exists()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email not valid'),
    ]),
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

