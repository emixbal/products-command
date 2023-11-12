import * as amqp from 'amqplib';

class RabbitMQHandler {
    private connection: amqp.Connection | null = null;

    constructor(private connectionString: string) {}

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.connectionString);
            const channel = await this.connection.createChannel();

            await this.setupQueue(channel, 'queue1', this.handleQueue1Message);
            await this.setupQueue(channel, 'queue2', this.handleQueue2Message);

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

    private handleQueue1Message(msg: amqp.ConsumeMessage | null): void {
        if (msg) {
            console.log('- Received', msg.content.toString());
        }
    }

    private handleQueue2Message(msg: amqp.ConsumeMessage | null): void {
        if (msg) {

            const json_data = JSON.parse(msg.content.toString());

            const dateAwal:number =  new Date(json_data?.send_time).getTime()
            const dateAhir:number =  new Date().getTime()

            console.log(json_data);
            console.log(`His name is ${json_data.name}`);
            console.log(`His Job is ${json_data.job}`);
            console.log( "time:", (dateAhir - dateAwal)/1000, "s");
            console.log( "time:", (dateAhir - dateAwal), "ms");
        }
    }
}

// Example usage:
const rabbitMQHandler = new RabbitMQHandler('amqp://127.0.0.1');
rabbitMQHandler.connect();
