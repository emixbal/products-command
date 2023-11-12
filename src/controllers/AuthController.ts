import { Request, Response } from "express";
import { uuid } from 'uuidv4';

const db = require("../db/models")
import PasswordHash from '../utils/PasswordHash'
import jwtToken from '../utils/JWTToken'

class Controller {
    login = async (req: Request, res: Response): Promise<Response> => {
        const { username, email, password } = req.body

        const whereFilter = (username)
            ?
            {
                username
            }
            :
            {
                email
            }


        const user = await db.user.findOne({
            where: whereFilter
        });

        if (!user) {
            return res.status(400).json({ "message": "user not found", "data": null })
        }

        const isValid: boolean = await PasswordHash.compare(password, user.password)

        if (!isValid) {
            return res.status(400).json({ "message": "password salah", "data": null })
        }

        const object = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }

        const token: string = await jwtToken.generateToken(object)

        return res.status(200).json({
            "message": "ok", "data": {
                object,
                token
            }
        })
    }

    register = async (req: Request, res: Response): Promise<Response> => {
        const { username, email, password } = req.body

        const passwordHashed = await PasswordHash.hash(password)

        try {
            await db.user.create({ id: uuid(), username, email, password: passwordHashed })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                "message": "nok",
                "data": null,
            })
        }

        return res.status(200).json({ "message": "ok", "data": null })
    }
}

export default new Controller();