import * as amqp from 'amqplib';

const db = require("../db/models");

class RabbitMQHandler {
    private connectionString: string = process.env.AMQP_HOST || 'amqp://127.0.0.1';
    private connection: amqp.Connection | null = null;
    private reconnectInterval: number = 5000; // 5 seconds

    constructor() { }

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.connectionString);
            this.connection.on('error', (error) => this.handleConnectionError(error));
            this.connection.on('close', () => this.handleConnectionClose());

            await this.setupQueue('product-save', this.handleProductSave);
        } catch (error) {
            console.warn(error);
            this.scheduleReconnect();
        }
    }

    private handleConnectionError(error: Error): void {
        console.error('RabbitMQ connection error:', error.message);
        this.scheduleReconnect();
    }

    private handleConnectionClose(): void {
        console.error('RabbitMQ connection closed unexpectedly');
        this.scheduleReconnect();
    }

    private scheduleReconnect(): void {
        setTimeout(() => {
            console.log('Reconnecting to RabbitMQ...');
            this.connect();
        }, this.reconnectInterval);
    }

    private async setupQueue(queueName: string, handleMessage: (msg: amqp.ConsumeMessage | null) => void): Promise<void> {
        if (!this.connection) {
            console.error('Not connected to RabbitMQ. Cannot set up queue.');
            return;
        }

        const channel = await this.connection.createChannel();
        const queue = await channel.assertQueue(queueName, { durable: false });

        if (queue) {
            await channel.consume(queueName, handleMessage, { noAck: true });
            console.log(`* Waiting for messages in ${queueName}. Ctrl+C to exit`);
        }
    }

    private handleProductSave = async (msg: amqp.ConsumeMessage | null): Promise<void> => {
        if (msg) {
            const json_data = JSON.parse(msg.content.toString());
            const { name, price, id } = json_data;

            try {
                await db.product.create({ id, name, price });
            } catch (error) {
                console.log(error);
            }
            console.log(json_data);
            // const dateAwal: number = new Date(json_data?.send_time).getTime();
            // const dateAhir: number = new Date().getTime();
            // console.log("time:", (dateAhir - dateAwal) / 1000, "s");
            // console.log("time:", (dateAhir - dateAwal), "ms");
        }
    }
}

export default RabbitMQHandler;
