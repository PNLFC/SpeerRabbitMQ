const amqplib = require('amqplib');

const addEntry = async (message) => {
    const q = 'Databasework';
    const conn = await amqplib.connect('amqp://localhost:5672');
    const ch = await conn.createChannel();
    await ch.assertQueue(q);
    const qm = JSON.stringify(message);
    return ch.sendToQueue(q, Buffer.from(qm, 'utf8'));
}

module.exports = addEntry