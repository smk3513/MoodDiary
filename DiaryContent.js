import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, onSnapshot, orderBy, query, where} from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH as auth } from './FireBaseConfig';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* access to emotional images */
const emotions = [
  { id: 'happy', image: require('./images/emotion_1.png') },
  { id: 'good', image: require('./images/emotion_2.png') },
  { id: 'fair', image: require('./images/emotion_3.png') },
  { id: 'sad', image: require('./images/emotion_4.png') },
  { id: 'bad', image: require('./images/emotion_5.png') },
];

const DiaryContent = ({ route, navigation }) => {
  const { newDiary, diaryId, diaryToEdit } = route.params || {};
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryText, setDiaryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  
  /* get curr date */ 
  const currentDate = new Date().toLocaleDateString();
  const [diary, setDiary] = useState([]);

  useEffect(() => {
    const loadDiary = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        const storedDiaries = await AsyncStorage.getItem('diaries');
        setDiary(storedDiaries ? JSON.parse(storedDiaries) : []);
        return;
      }

      if (diaryToEdit) {
        console.log("edit tried in diary content");
        const diaryRef = doc(FIRESTORE_DB, 'diaries', diaryId);
        const diarySnap = await getDoc(diaryRef);
  
        if (diarySnap.exists()) {
          const diaryData = diarySnap.data();
          setDiaryTitle(diaryData.diaryTitle);
          setDiaryText(diaryData.diaryText);
          setSelectedEmotion(diaryData.selectedEmotion);
          return;
        }
      }

      const diariesQuery = query(
        collection(FIRESTORE_DB, 'diaries'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribe = onSnapshot(diariesQuery, snapshot => {
        const newDiary = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        AsyncStorage.setItem('diaries', JSON.stringify(newDiary));

        setDiary(newDiary);
      });

      return () => unsubscribe();
    };

    loadDiary();
  }, [diaryToEdit, diaryId]);

  const saveDiary = async () => {
    setIsLoading(true);

    const diaryEntry = {
      diaryTitle,
      diaryText,
      selectedEmotion,
      date: serverTimestamp(),
      userId: auth.currentUser.uid
    };
    
    // Check if an emotion is selected
    if (!selectedEmotion) {
      // If no emotion is selected, show an alert and return
      Alert.alert('Error', 'Please select an emotion before saving the diary.');
      return;
    }

    const diaryCollection = collection(FIRESTORE_DB, 'diaries');
    
    try {
      // saving a new diary entry
      if (newDiary) {
        await addDoc(diaryCollection, {
          ...diaryEntry,
          createdAt: serverTimestamp(),
        });
      // editing existing diary
      } else if (diaryToEdit) {
        const diaryRef = doc(FIRESTORE_DB, 'diaries', diaryId);
        await setDoc(diaryRef, {
          ...diaryEntry,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error saving diary: ', error);
    } finally {
      navigation.navigate('DiaryList', {selectedEmotion});
      setIsLoading(false);
    }
  };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            >
            <ScrollView>
            <View style={styles.container}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <View style={styles.emotionsContainer}>
                {emotions.map((emotion) => (
                <TouchableOpacity key={emotion.id} onPress={() => setSelectedEmotion(emotion.id)}>
                    <Image source={emotion.image} style={[
                    styles.emotionImage,
                    selectedEmotion === emotion.id && styles.selectedEmotion,
                    ]} />
                </TouchableOpacity>
                ))}
            </View>
            <TextInput
                style={styles.diaryTitleInput}
                placeholder="Title"
                value={diaryTitle}
                onChangeText={setDiaryTitle}
            />
            <TextInput
                style={styles.diaryInput}
                multiline
                placeholder="How was your day?"
                value={diaryText}
                onChangeText={setDiaryText}
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => saveDiary()}>
                <Text style={styles.saveButtonText}>Save Diary</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        dateText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            alignSelf: 'center'
        },
        emotionsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
        },
        emotionImage: {
            width: 50,
            height: 50,
        },
        selectedEmotion: {
            borderColor: 'skyblue',
            borderWidth: 3,
        },
        diaryTitleInput: {
            borderRadius:10,
            height: 40,
            borderColor: 'burlywood',
            borderWidth: 1,
            marginBottom: 20,
            padding: 10,
        },
        diaryInput: {
            borderRadius:10,
            height: 200,
            borderColor: 'burlywood',
            borderWidth: 1,
            marginBottom: 20,
            padding: 10,
            textAlignVertical: 'top',
        },
        saveButton: {
            backgroundColor: 'burlywood',
            padding: 10,
            alignItems: 'center',
            width: '50%', 
            borderRadius:5,
            alignSelf: 'center'
        },
        saveButtonText: {
            fontSize: 18,
            color: 'white',
        },
});

export default DiaryContent;
