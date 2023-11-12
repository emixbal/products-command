import { uuid } from 'uuidv4';

import BaseService from './BaseService'
const db = require("../db/models")
import { respons } from "../helpers/format";

class ProductService extends BaseService {
    public listing = async (): Promise<any> => {
        try {
            const result = await db.product.findAll()
            return respons(200, "ok", result)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }

    public store = async (): Promise<any> => {
        const { name, price } = this.body
        try {
            const result = await db.product.create({ id: uuid(), name, price })
            return respons(200, "ok", result)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }

    public getDetail = async (): Promise<any> => {
        try {
            const result = await db.user.findOne({
                where: { id: this.params.id }
            });
            return respons(200, "ok", result)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }
}

export default ProductService;