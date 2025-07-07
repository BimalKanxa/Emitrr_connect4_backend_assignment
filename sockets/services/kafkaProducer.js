const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'connect4-backend-assignment',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function initKafka() {
  try {
    console.log("🔌 Attempting to connect to Kafka...");
    await producer.connect();
    console.log("✅ Kafka producer connected");
  } catch (err) {
    console.error("❌ Kafka producer connection failed:", err.message);
  }
}


async function sendGameEvent(eventType, payload) {
  console.log("sending game event")
  await producer.send({
    topic: 'game-events',
    messages: [
      {
        key: eventType,
        value: JSON.stringify({ type: eventType, ...payload, timestamp: new Date() })
      }
    ]
  });
  console.log("game events sent")
}

module.exports = { initKafka, sendGameEvent };
