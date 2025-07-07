const { Kafka } = require('kafkajs');


const kafka = new Kafka({
  clientId: 'connect4-backend-assignment',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function runAnalyticsConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'game-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("📊 Analytics Event:", event);
      // You could store in DB or aggregate in memory
    } 
  });
 
  console.log("📈 Analytics consumer running...");
}

runAnalyticsConsumer();
