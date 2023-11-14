import * as amqp from 'amqplib';

const db = require("../db/models")

// Example usage:
// const rabbitMQHandler = new RabbitMQHandler('amqp://127.0.0.1');
// rabbitMQHandler.connect();

class RabbitMQHandler {
    private connection: amqp.Connection | null = null;
    private connectionString: string = 'amqp://127.0.0.1'

    constructor() { }

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.connectionString);
            const channel = await this.connection.createChannel();

            await this.setupQueue(channel, 'product-save', this.handleProductSave);

        } catch (error) {
            console.warn(error);
        }
    }

    private async setupQueue(channel: amqp.Channel, queueName: string, handleMessage: (msg: amqp.ConsumeMessage | null) => void): Promise<void> {
        const queue = await channel.assertQueue(queueName, { durable: false });
        if (queue) {
            await channel.consume(queueName, handleMessage, { noAck: true });
            console.log(`* Waiting for messages in ${queueName}. Ctrl+C to exit`);
        }
    }

    private handleProductSave = async (msg: amqp.ConsumeMessage | null): Promise<void> => {
        if (msg) {

            const json_data = JSON.parse(msg.content.toString());

            const { name, price, id } = json_data

            try {
                await db.product.create({ id, name, price })
            } catch (error) {
                console.log(error);
            }

            const dateAwal: number = new Date(json_data?.send_time).getTime()
            const dateAhir: number = new Date().getTime()
            console.log(json_data);
            console.log("time:", (dateAhir - dateAwal) / 1000, "s");
            console.log("time:", (dateAhir - dateAwal), "ms");
        }
    }
}

export default RabbitMQHandler;
