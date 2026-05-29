import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MQTTService from './src/services/mqttService.js';
import StatusModal from './src/components/StatusModal.js';
import LightControl from './src/components/LightControl.js';
import Gauges from './src/components/Gauges.js';

const mqtt = new MQTTService();

export default function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightON, setIsLightON] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USER,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  
  console.log(process.env.EXPO_PUBLIC_MQTT_HOST);
  console.log(process.env.EXPO_PUBLIC_MQTT_PORT);
  console.log(process.env.EXPO_PUBLIC_MQTT_PATH);
  console.log(process.env.EXPO_PUBLIC_MQTT_USER);



  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = () => {

    setShowError(false);

    mqtt.connect(

      mqttConfig,

      (topic, message) => {

        if (topic === 'casa/temp')
          setTemp(parseFloat(message));

        if (topic === 'casa/umid')
          setHum(parseFloat(message));

        if (topic === 'casa/luz')
          setIsLightON(message === "1");
      },

      () => {

        setIsConnected(true);

        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },

      (err) => {

        console.log(err);

        setIsConnected(false);
        setShowError(true);
      },
    );
  };

  const toggleLight = () => {

    const newState = isLightON ? "0" : "1";

    mqtt.publish('casa/luz', newState);
  };

  return (

    <View style={styles.container}>

      <Text style={styles.header}>
        Smart Home IoT
      </Text>

      <LightControl
        isLightON={isLightON}
        onToggle={toggleLight}
      />

      <Gauges
        temp={temp}
        hum={hum}
      />

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    padding: 10,
  },

  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },

});
