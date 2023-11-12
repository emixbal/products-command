import { uuid } from 'uuidv4';

import BaseService from './BaseService'
const db = require("../db/models")
import { respons } from "../helpers/format";
import PasswordHash from '../utils/PasswordHash'


class UserService extends BaseService {
    public listing = async (): Promise<any> => {
        try {
            const users = await db.user.findAll()
            return respons(200, "ok", users)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }

    public store = async (): Promise<any> => {
        const { username, email, password } = this.body
        const passwordHashed = await PasswordHash.hash(password)

        try {
            const user = await db.user.create({ id: uuid(), username, email, password: passwordHashed })
            return respons(200, "ok", user)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }
}

export default UserService;