
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import diaryImage from './images/home.png';

/* Typying effect on click here to start */
const TypingText = ({ text, typingSpeed }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, []);

  return <Text style={styles.textStyle}>{displayedText}</Text>;
};

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
        <Image source={diaryImage} style={styles.image} />
        <Text style={styles.textStyle}>Time to Look at Real Me, Mood Diary</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <TypingText text="click here to start" typingSpeed={100} />
        </TouchableOpacity>
        <StatusBar style="auto" />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 300,
    marginBottom: 10
  },
  textStyle: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10 
  }
});
