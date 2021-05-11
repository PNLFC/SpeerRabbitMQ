const amqp = require("amqplib");
const worker = require("./worker");

const connect = async () => {
    try {
        const q = 'Databasework';
        const amqpServer = "amqp://localhost:5672"
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel();
        await channel.assertQueue(q);
        
        channel.consume(q, async (message) => {
            const input = JSON.parse(message.content.toString());
            console.log(message.content.toString())
            await worker(input)
            channel.ack(message);
        })

        console.log("Waiting for messages...")
    
    }
    catch (ex){
        console.error(ex)
    }

}
connect();