import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import axios from 'axios'

export default function TabOneScreen() {
  const [ip, setIp] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string>('');
  const [enableInput, setEnableInput] = useState(true);

  function validateIp(ip: string): boolean {
    const regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]{1,5})?$/;
    return regex.test(ip);
  }

  const handleEnableInput = () => {
    setConnected(false);
    setEnableInput(true);
  };

  const handleTest = async () => {
    if (!validateIp(ip)) {
      setError('La IP no tiene un formato válido');
      return;
    }

    try {
      const response = await axios.get(`http://${ip}/ping`);
      if (response.status === 200) {
        setConnected(true);
        setError('');
        setEnableInput(false);
      } else {
        throw new Error('Error al conectar al servidor');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Introduzca la dirección IP (con puerto)"
        value={ip}
        onChangeText={setIp}
        editable={enableInput}
      />
      <Button title="Probar conexión" disabled={connected} onPress={handleTest} />
      {connected && (
        <Text style={styles.messageSuccess}>Conectado correctamente!</Text>
      )}
      {error && <Text style={styles.messageError}>{error}</Text>}
      {connected  && (
        <Button title="Volver a conectar" onPress={handleEnableInput} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  messageSuccess: {
    color: 'green',
    marginBottom: 10,
  },
  messageError: {
    color: 'red',
    marginBottom: 10,
  },
});
