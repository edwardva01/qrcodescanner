import EditScreenInfo from '@/components/EditScreenInfo';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { RandomReveal } from 'react-random-reveal'


export default function ContestScreen() {
  
  const [winnerNumber, setWinnerNumber] = useState("");
  const [winnerNumberSilla, setWinnerNumberSilla] = useState("");
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const [firstComplete, setFirstComplete] = useState(false)

  const onInit = async() => {
    const response:any = await axios.get("https://5558-75-13-64-129.ngrok-free.app/mesas-contest");

      response.data.mesas.sort(() => Math.random() - 0.5);
      setWinnerNumber(response.data.mesas[0].toString());
    setIsPlaying(true)
  }

  const onCompleteFirst = async () => {
    console.log("on coplete");
    setFirstComplete(true)
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const response = await axios.get("https://5558-75-13-64-129.ngrok-free.app/sillas-contest?mesa=" + winnerNumber, {headers});
    
    response.data.sillas.sort(() => Math.random() - 0.5);
    console.log("estelin", response.data.sillas[0].toString())
    setWinnerNumberSilla(response.data.sillas[0].toString());
  }

  useEffect(() => {
    console.log("voy1");
    (async () => {
      console.log("voy2");
      //const response:any[] = await axios.get("https://5558-75-13-64-129.ngrok-free.app/mesas-contest");
      
      
    })();
    
  }, []);

  
  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <Button title={'Contest Reveal'} onPress={() => {onInit()}}></Button>
      <Text style={styles.paragraph}>MESA</Text>
      <Text style={styles.paragraph}>
        <RandomReveal onComplete={()=>{onCompleteFirst()}} characterSet={['0','1','2','3','4','5','6','7','8','9']} isPlaying={isPlaying} duration={10} characters={winnerNumber} />
        </Text>
        {firstComplete && <Button title={'Continue'} onPress={() => {setIsPlaying2(true)}}></Button>}
        <Text style={styles.paragraph}>SILLA</Text>
        <Text style={styles.paragraph}>
        <RandomReveal onComplete={()=>{}} characterSet={['0','1','2','3','4','5','6','7','8','9']} isPlaying={isPlaying2} duration={10} characters={winnerNumberSilla} />
        </Text>
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
  paragraph: {
    margin: 24,
    fontSize: 42,
    textAlign: 'center',
  },
});
