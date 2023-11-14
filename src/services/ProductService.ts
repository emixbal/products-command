import { uuid } from 'uuidv4';
require("dotenv").config()

import BaseService from './BaseService'
const db = require("../db/models")
import { respons } from "../helpers/format";
import MQProducer from '../utils/MQProducer'
import { sequelize } from '../db/models';

class ProductService extends BaseService {
    /**
     * crud biasa
     * @returns Promise<any>
     */
    public listing = async (): Promise<any> => {
        try {
            const result = await db.product.findAll()
            return respons(200, "ok", result)
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }
    }

    /**
     * Untuk menyimpan data ke db command lalu jika sukses dikirim ke db query via message broker.
     * Jika pengiriman dengan message broker gagal data yang sudah disimpan di rollback.
     * 
     * @returns Promise<any>
     */
    public store = async (): Promise<any> => {
        const { name, price } = this.body
        let product = {
            id: uuid(), name, price, send_time: new Date()
        }

        // simpan ke database
        const tr = await sequelize.transaction()
        try {
            product = await db.product.create(product, { transaction: tr })
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }

        try {
            const rabbitMQProducer = new MQProducer();
            await rabbitMQProducer.sendMessageRetry("product-save", JSON.stringify(product), 3)
        } catch (error) {
            console.log("============== ERROR ==============");
            await tr.rollback();
            return respons(500, "something went wrong", null);
        }

        // Everything ok
        console.log("============== SUKSES ==============");
        await tr.commit();
        return respons(200, "ok", product)
    }

    /**
     * crud biasa
     * @returns Promise<any>
     */
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

    /**
     * crud biasa
     * @returns Promise<any>
     */
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

    /**
     * crud biasa
     * @returns Promise<any>
     */
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