import { Request, Response, NextFunction } from "express";
import jwtToken from '../utils/JWTToken'

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let headers: string = req.headers.authorization || ''
    if (!headers) {
        return res.status(401).json({
            "message": "nok",
            "error": "Header Authorization required",
            "data": null,
        })
    }

    const token: string = headers.split(" ")[1];
    const [isValid, user] = await jwtToken.verifyToken(token)

    if (!isValid) {
        return res.status(401).json({
            "message": "nok",
            "error": "invalid token",
            "data": null,
        })
    }
    
    res.locals.user = user;
    return next()
} 