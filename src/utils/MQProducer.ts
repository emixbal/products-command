import * as amqp from 'amqplib';

class MQProducer {
    private connection: amqp.Connection | null = null;

    constructor(private connectionString: string) { }

    async sendMessages(queueName: string, data: string): Promise<boolean> {
        try {
            this.connection = await amqp.connect(this.connectionString);
            const channel = await this.connection.createChannel();

            channel.sendToQueue(queueName, Buffer.from(data));

        } catch (error) {
            console.warn(error);
            return false
        } finally {
            // Close the connection after using.
            if (this.connection) {
                setTimeout(() => this.connection?.close(), 500);
            }
        }
        
        return true
    }
}

export default MQProducer;

// const rabbitMQProducer = new MQProducer('amqp://127.0.0.1');
// rabbitMQProducer.produceMessages("queue1", "okkk");
