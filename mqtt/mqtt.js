// file: mqtt.js
const mqtt = require('mqtt');

// const MQTT_SERVER_IP = process.env.MQTT_SERVER_IP;
const MQTT_SERVER_IP = 'localhost';
const MQTT_SERVER_PORT = process.env.MQTT_SERVER_PORT;
console.log(`mqtt://${MQTT_SERVER_IP}:${MQTT_SERVER_PORT}`);

const mqttClient = mqtt.connect(`mqtt://${MQTT_SERVER_IP}:${MQTT_SERVER_PORT}`);

mqttClient.on('connect', () => {
  console.log('MQTT client connected');
});

const subscribedTopics = new Set();

const currentAnglesMap = new Map();
const currentEsp32StatusMap = new Map();

mqttClient.on('message', (topic, message) => {
  const macAddress = topic.split('/')[1];

  if (topic.endsWith('angles')) {
    currentAnglesMap.set(macAddress, JSON.parse(message.toString()));
  } else if (topic.endsWith('esp32Status')) {
    currentEsp32StatusMap.set(macAddress, JSON.parse(message.toString()));
  }
});

const getCurrentAngles = (macAddress) => currentAnglesMap.get(macAddress) || {};
const getCurrentEsp32Status = (macAddress) => currentEsp32StatusMap.get(macAddress) || {};

module.exports = {
  mqttClient,
  subscribedTopics,
  currentAnglesMap,
  currentEsp32StatusMap,
  getCurrentAngles,
  getCurrentEsp32Status,
};
