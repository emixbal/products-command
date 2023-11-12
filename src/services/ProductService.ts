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
            const product = await db.product.findOne({
                where: { id: this.params.id }
            });

            if (!product) {
                return respons(400, "Data not found", null);
            }

            return respons(200, "ok", product)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }

    public updateDetail = async (): Promise<any> => {
        const { name, price } = this.body
        try {
            const product = await db.product.findOne({
                where: { id: this.params.id }
            });

            if (!product) {
                return respons(400, "Data not found", null);
            }

            product.name = name
            product.price = price

            product.save()

        } catch (error) {
            console.log(error);
            return respons(500, "Something went wrong", null);
        }

        return respons(200, "ok", null);
    }

    public deleteDetail = async (): Promise<any> => {
        try {
            const product = await db.product.findOne({
                where: { id: this.params.id }
            });

            if (!product) {
                return respons(400, "Data not found", null);
            }

            await product.destroy()
        } catch (error) {
            console.log(error);
            return respons(500, "Something went wrong", null);
        }

        return respons(200, "ok", null);
    }
}

export default ProductService;