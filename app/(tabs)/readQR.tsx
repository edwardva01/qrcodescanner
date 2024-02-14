import EditScreenInfo from '@/components/EditScreenInfo';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function ReadQRScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(false);
  const [codigoCompra, setCodigoCompra] = useState("");
  const [uuid, setUuid] = useState("");
  const [entrada,setEntrada] = useState("");

  interface BarcodeData {
    type: string;
    data: string;
  }

  useEffect(() => {
    console.log("voy1");
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      console.log("voy2");
      try {
    let uuidTmp = uuidv4();
    console.log("uuidTmp", uuidTmp);
let fetchUUID = await SecureStore.getItemAsync('secure_deviceid');
console.log("fetchUUID", JSON.parse(fetchUUID!!));
  //if user has already signed up prior
  if (fetchUUID) {
    uuidTmp = JSON.parse(fetchUUID!!)
  }

await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(uuidTmp));
setUuid(uuidTmp);
} catch (error) {
  // Manejar el error de la solicitud
  console.log('Error al realizar la solicitud:', error);
}
})();
  }, []);

  const obtenerEntrada = async (idEntrada:string) => {
    try {
      const response = await axios.get("https://5558-75-13-64-129.ngrok-free.app/buscar-entrada?entrada=" + idEntrada);
      setEntrada(idEntrada) 
      if (response.data.success) {
        // Entrada verificada correctamente
        //alert('Entrada verificada correctamente');
        setScanned(false);
        setCodigoCompra(response.data.compra)
        setConfirmed(true)
      } else {
        // Mostrar mensaje de error
        console.log('Error al verificar la entrada:', response.data.message);
      }
    } catch (error:any) {
      // Manejar el error de la solicitud
      alert(error.response.data.message);
      console.log('Error al realizar la solicitud:', error.response.data.message);
    }
  };

  const onAgain = () => {
    setScanned(false);
    setConfirmed(false);
    setCodigoCompra("");
    setEntrada("");
    setUuid("")
  }

  const onConfirm = () => {
    setScanned(true)
    verificarEntrada(entrada)
  }

  const verificarEntrada = async (idEntrada:string) => {
    try {
      const response = await axios.put("http://5558-75-13-64-129.ngrok-free.app/verificar-entrada", {
        id_entrada: idEntrada,
        id_dispositivo: uuid,
      });
  
      if (response.data.success) {
        // Entrada verificada correctamente
        alert('Entrada verificada correctamente');
        onAgain();
      } else {
        // Mostrar mensaje de error
        console.log('Error al verificar la entrada:', response.data.message);
      }
    } catch (error:any) {
      // Manejar el error de la solicitud
      alert(error.response.data.message);
      console.log('Error al realizar la solicitud:', error.response.data.message);
    }
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeData) => {
    // ...
    setScanned(true);
   // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    //verificarEntrada(data)
   // setConfirmed(true);
    obtenerEntrada(data)
  };
if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
}
if (hasPermission === false) {
    return <Text>No access to camera</Text>;
}

  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{width:wp("90%"), height:hp("60%")}}
      />
      <Text style={{fontSize:24, fontWeight:"bold"}}>{`Orden #${codigoCompra}`}</Text>
      {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => onAgain() } />} */}
      {confirmed && <Button title={'Confirm'} onPress={() => onConfirm()} />}
      {scanned && <Button title={'Continue'} onPress={() => setScanned(false)} />}
      {confirmed && <Button color={"red"} title={'Cancel'} onPress={() => onAgain()} />}
       {/* <Button title={'Tap to Scan Simula'} onPress={() => scanned ? undefined : handleBarCodeScanned({"type":"","data":"5343"})} />  */}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
