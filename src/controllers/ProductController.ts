import { Request, Response } from "express";
import IController from "./ControllerInterfaces";
import ProductService from "../services/ProductService";

const db = require("../db/models")

class App implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        const service: ProductService = new ProductService(req, res);
        const result = await service.listing()
        return res.status(result.status).json(result)
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        const service: ProductService = new ProductService(req, res);
        const result = await service.store()
        return res.status(result.status).json(result)
    }

    show = async (req: Request, res: Response): Promise<Response> => {
        const service: ProductService = new ProductService(req, res);
        const result = await service.getDetail()
        return res.status(result.status).json(result)
    }

    update(req: Request, res: Response): Response {
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

export default new App();