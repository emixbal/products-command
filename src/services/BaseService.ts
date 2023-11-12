import { Request, Response } from "express";

abstract class BaseService {
    cred: {
        id: number,
    }
    body: Request['body'];
    params: Request['params'];

    constructor(req: Request, res: Response) {
        this.cred = res.locals.user
        this.body = req.body
        this.params = req.params
    }
}

export default BaseService;