// Import dependencies
import { Kafka } from "kafkajs";

// Initialize Kafka client and consumer
const kafka = new Kafka({
    clientId: 'kafka-consumer-app',
    brokers: ['localhost:9092'] // Ganti dengan broker Kafka Anda
});

const consumer = kafka.consumer({ groupId: 'test-group' });

// Function to run the consumer
const runConsumer = async () => {
    try {
        console.log('Connecting to Kafka...');
        await consumer.connect();
        console.log('Connected to Kafka');

        // Subscribe to a topic
        const topic = 'test-topic'; // Ganti dengan nama topik Anda
        await consumer.subscribe({ topic, fromBeginning: true });
        console.log(`Subscribed to topic: ${topic}`);

        // Consume messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Received message from topic ${topic} | Partition ${partition}`);
                console.log(`Key: ${message.key?.toString() || 'null'}, Value: ${message.value.toString()}`);
            },
        });
    } catch (error) {
        console.error('Error in Kafka consumer:', error);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing Kafka consumer...');
    await consumer.disconnect();
    console.log('Kafka consumer closed');
    process.exit(0);
});

// Run the consumer
runConsumer();
