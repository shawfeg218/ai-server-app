// file: mqtt/esp32Function.js

const {
  mqttClient,
  subscribedTopics,
  currentAnglesMap,
  currentEsp32StatusMap,
  getCurrentAngles,
  getCurrentEsp32Status,
} = require('./mqtt');

module.exports.resetWifi = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    console.log('Reset Wifi, macAddress: ', macAddress);

    mqttClient.publish(`esp32/${macAddress}/control/reset-wifi`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in resetWifi: ${errorMessage}`);
  }
};

module.exports.setAxisAngle = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    const angles = req.body.targetAngles;
    console.log(`set angles to ${angles}, macAddress: ${macAddress}`);

    mqttClient.publish(`esp32/${macAddress}/control/set-axis-angle`, JSON.stringify(angles));
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in setAxisAngle: ${errorMessage}`);
  }
};
module.exports.TsetAxisAngle = (req, res) => {
  try {
    const angles = req.body.targetAngles;
    console.log(`set all to ${angles}`);

    mqttClient.publish(`esp32/Teacher/control/set-axis-angle`, JSON.stringify(angles));
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in setAxisAngle: ${errorMessage}`);
  }
};

module.exports.correctAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    console.log('correctAct, macAddress: ', macAddress);

    mqttClient.publish(`esp32/${macAddress}/control/correct-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in correctAct: ${errorMessage}`);
  }
};
module.exports.TcorrectAct = (req, res) => {
  try {
    console.log('All correctAct');

    mqttClient.publish(`esp32/Teacher/control/correct-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in correctAct: ${errorMessage}`);
  }
};

module.exports.wrongAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    console.log('wrongAct, macAddress: ', macAddress);

    mqttClient.publish(`esp32/${macAddress}/control/wrong-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in wrongAct: ${errorMessage}`);
  }
};
module.exports.TwrongAct = (req, res) => {
  try {
    console.log('All wrongAct');

    mqttClient.publish(`esp32/Teacher/control/wrong-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in wrongAct: ${errorMessage}`);
  }
};

module.exports.grabAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    console.log('grabAct, macAddress: ', macAddress);

    mqttClient.publish(`esp32/${macAddress}/control/grab-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in grabAct: ${errorMessage}`);
  }
};
module.exports.TgrabAct = (req, res) => {
  try {
    console.log('All grabAct');

    mqttClient.publish(`esp32/Teacher/control/grab-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in grabAct: ${errorMessage}`);
  }
};

module.exports.resetArm = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    console.log('resetArm, macAddress: ', macAddress);

    mqttClient.publish(`esp32/${macAddress}/control/reset-arm`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in resetArm: ${errorMessage}`);
  }
};
module.exports.TresetArm = (req, res) => {
  try {
    console.log('All resetArm');

    mqttClient.publish(`esp32/Teacher/control/reset-arm`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in resetArm: ${errorMessage}`);
  }
};

module.exports.speakAct = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;
    console.log('speakAct, macAddress: ', macAddress);

    mqttClient.publish(`esp32/${macAddress}/control/speak-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in speakAct: ${errorMessage}`);
  }
};
module.exports.TspeakAct = (req, res) => {
  try {
    console.log('All speakAct');

    mqttClient.publish(`esp32/Teacher/control/speak-act`, '');
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in TspeakAct: ${errorMessage}`);
  }
};

// -- get eap32 -- //

module.exports.unsubscribeTopic = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    const anglesTopic = `esp32/${macAddress}/angles`;
    const statusTopic = `esp32/${macAddress}/esp32Status`;

    if (subscribedTopics.has(anglesTopic)) {
      mqttClient.unsubscribe(anglesTopic);
      subscribedTopics.delete(anglesTopic);
      currentAnglesMap.delete(macAddress);
      console.log('unsubscribeTopic: ', anglesTopic);
    }
    if (subscribedTopics.has(statusTopic)) {
      mqttClient.unsubscribe(statusTopic);
      subscribedTopics.delete(statusTopic);
      currentEsp32StatusMap.delete(macAddress);
      console.log('unsubscribeTopic: ', statusTopic);
    }

    console.log('Topics: ', subscribedTopics.size);
    res.status(204).send();
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in unsubscribeTopic: ${errorMessage}`);
  }
};

module.exports.getAngles = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    const anglesTopic = `esp32/${macAddress}/angles`;
    if (!subscribedTopics.has(anglesTopic)) {
      mqttClient.subscribe(anglesTopic);
      console.log('subscribedTopics: ', anglesTopic);
      subscribedTopics.add(anglesTopic);
    }

    mqttClient.publish(`esp32/${macAddress}/control/get-angles`, '');
    res.status(200).send(getCurrentAngles(macAddress));
    // console.log(getCurrentAngles(macAddress));
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in getAngles: ${errorMessage}`);
  }
};

module.exports.getEsp32Status = (req, res) => {
  try {
    const macAddress = req.body.connectedMacAddress;

    const statusTopic = `esp32/${macAddress}/esp32Status`;
    if (!subscribedTopics.has(statusTopic)) {
      mqttClient.subscribe(statusTopic);
      console.log('subscribedTopics: ', statusTopic);
      subscribedTopics.add(statusTopic);
    }

    mqttClient.publish(`esp32/${macAddress}/control/get-esp32Status`, '');
    res.status(200).send(getCurrentEsp32Status(macAddress));
    // console.log(getCurrentEsp32Status(macAddress));
  } catch (error) {
    let errorMessage = error.message ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error in getEsp32Status: ${errorMessage}`);
  }
};
