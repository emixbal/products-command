import { Request, Response } from "express";

import IController from "./ControllerInterfaces";

class TodoController {
    index(req: Request, res: Response): Response {
        console.log(res.locals.user);
        return res.status(200).json({ "message": "ok" })
    }
    
    create(req: Request, res: Response): Response {
        return res.status(200).json({ "message": "ok", "data": req.body })
    }
    
    update(req: Request, res: Response): Response {
        let data: {} = {
            "message": "ok",
            "id": req.params.id,
            "data": req.body
        }

        return res.status(200).json(data)
    }
    show(req: Request, res: Response): Response {
        let data: {} = {
            "message": "ok",
            "id": req.params.id,
            "data": req.body
        }

        return res.status(200).json(data)
    }
    delete(req: Request, res: Response): Response {
        let data: {} = {
            "message": "ok",
            "id": req.params.id,
            "data": req.body
        }

        return res.status(200).json(data)
    }
}

export default new TodoController();