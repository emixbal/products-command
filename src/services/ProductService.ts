import { uuid } from 'uuidv4';
require("dotenv").config()

import BaseService from './BaseService'
const db = require("../db/models")
import { respons } from "../helpers/format";
import MQProducer from '../utils/MQProducer'

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
        const t = await db.transaction();
        try {
            product = await db.product.create(product, { transaction: t })
        } catch (error) {
            console.log(error);
            return respons(500, "something went wrong", null)
        }

        const rabbitMQProducer = new MQProducer();
        let retryCount = 0;
        let isSend = await rabbitMQProducer.sendMessages("product-save", JSON.stringify(product));

        // Ulangi pengiriman hingga 3 kali jika isSend adalah false
        while (!isSend && retryCount < 3) {
            retryCount++;
            console.warn(`Failed to send message. Retrying attempt ${retryCount}...`);
            isSend = await rabbitMQProducer.sendMessages("product-save", JSON.stringify(product));
        }

        // jika masih gagal juga
        if (!isSend) {
            // We rollback the transaction karena kirim data ke message broker gagal.
            await t.rollback();
            return respons(500, "Failed to send message after 3 attempts", null);
        }

        // averything ok
        await t.commit();
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