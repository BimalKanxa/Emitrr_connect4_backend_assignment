const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'connect4-backend-assignment',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

(async () => {
  try {
    console.log("🔌 Connecting...");
    await producer.connect();
    console.log("✅ Connected!");

    await producer.send({
      topic: 'game-events',
      messages: [
        { key: 'test', value: 'Hello from testKafka!' }
      ]
    });

    console.log("📤 Message sent");
    await producer.disconnect();
  } catch (err) {
    console.error("❌ Kafka test failed:", err.message);
  }
})();
