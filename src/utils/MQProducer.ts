import * as amqp from 'amqplib';

class MQProducer {
    private connection: amqp.Connection | null = null;

    /**
     * 
     * @param queueName Merupakan nama queue dari channel
     * @param data Berisi data yang akan dikirim. Jika belum berupa string maka konversi ke string dulu. Misalnya JSON.stringty({}||[])
     * 
     * @returns Promise return berupa true atau false.
     */
    async sendMessages(queueName: string, data: string): Promise<boolean> {
        try {
            const connectionString = process.env.AMQP_HOST;
            
            if (!connectionString) {
                console.log("connectionString err", connectionString);
                
                return false;
            }

            this.connection = await amqp.connect(connectionString);
            const channel = await this.connection.createChannel();

            channel.sendToQueue(queueName, Buffer.from(data));

        } catch (error) {
            console.warn(error);
            return false;
        } finally {
            // Close the connection after using.
            if (this.connection) {
                setTimeout(() => this.connection?.close(), 500);
            }
        }

        return true;
    }
}

export default MQProducer;

// contoh penggunaan:
// const rabbitMQProducer = new MQProducer();
// rabbitMQProducer.produceMessages("queue1", "okkk");
