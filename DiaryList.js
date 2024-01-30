import React, { route, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { doc, deleteDoc, collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { FIRESTORE_DB } from './FireBaseConfig';
import { FIREBASE_AUTH } from './FireBaseConfig';

/* for creating flat list */
const DiaryItem = ({ diary, onDelete, onEdit, selectedEmotion }) => {
  /* access to emotional images */
  const getEmotionImage = (selectedEmotion) => {
      const emotionImages = {
          'happy': require('./images/emotion_1.png'),
          'good': require('./images/emotion_2.png'),
          'fair': require('./images/emotion_3.png'),
          'sad': require('./images/emotion_4.png'),
          'bad': require('./images/emotion_5.png'),
      };
      const image = emotionImages[selectedEmotion] || null;
      return image;
  };
  return (
      <View style={styles.diaryItem}>
          <Text style={styles.diaryDate}>{diary.date}</Text>
          <Image source={getEmotionImage(diary.selectedEmotion)} style={styles.emotionImage} />
          {/* <TouchableOpacity onPress={() => onView(diary.id)}>
              <Text style={styles.viewButton}>View</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => onEdit(diary.id)}>
              <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(diary.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
    </View>
  );
};

export default function DiaryList( { route, navigation } ) {
  const [diaries, setDiaries] = useState([]);
  const [filteredDiaries, setFilteredDiaries] = useState([]);
  const { selectedEmotion } = route.params || {};  

  useEffect(() => {
    if (FIREBASE_AUTH.currentUser) {
      const diariesQuery = query(
        collection(FIRESTORE_DB, 'diaries'),
        where('userId', '==', FIREBASE_AUTH.currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(diariesQuery, (snapshot) => {
        const updatedDiaries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toLocaleDateString() || '',
        }));
        setDiaries(updatedDiaries);

        if (selectedEmotion) {
          const filtered = updatedDiaries.filter(diary => diary.selectedEmotion === selectedEmotion);
          setFilteredDiaries(filtered);
        } else {
          setFilteredDiaries(updatedDiaries);
        }
      });

      return () => unsubscribe();
    }
  }, [FIREBASE_AUTH.currentUser, selectedEmotion]);



  /* adding new diary : navigating to DiaryContent */
  const addDiary = () => {
    navigation.navigate('DiaryContent', { 
        newDiary: true,
    });
  };

  /* delete selected diary */
  const deleteDiary = (docId) => {
    Alert.alert(
      "Delete Diary",
      "Are you sure you want to delete this diary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const diaryRef = doc(FIRESTORE_DB, 'diaries', docId);
            await deleteDoc(diaryRef);
          },
        }
      ]
    );
  };

  /* edit selected diary : navigating to DiaryContent */
  const editDiary = (docId) => {
      navigation.navigate('DiaryContent', { diaryId: docId, diaryToEdit: true });
  };

  /* WILL BE IMPLEMENTED LATER */
  // /* view selected diary detail : navigating to DiaryDetail */
  // const viewDiary = (diaryId) => {
  //     const diaryToView = diaries.find((diary) => diary.id === diaryId);
  //     if (diaryToView) {
  //       navigation.navigate('DiaryDetail', { diary: diaryToView });
  //     } else {
  //       console.warn("Diary not found");
  //     }
  // };

  /* add button at header calling addDiary func */
  const renderAddButton = () => {
      return (
          <TouchableOpacity
            onPress={() => addDiary('New Diary')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add New Diary</Text>
          </TouchableOpacity>
        );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={diaries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DiaryItem 
            diary={item} 
            onDelete={deleteDiary} 
            onEdit={editDiary}
            />
        )}
        ListHeaderComponent={renderAddButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  diaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  diaryText: {
    fontSize: 18,
  },
  addButton: {
      fontWeight: 'bold',
      backgroundColor: 'burlywood',
      padding: 10,
      alignItems: 'center',
      borderRadius: 10,
      width: '50%',
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10, 
  },
  addButtonText: {
      color: 'black',
      fontSize: 18,
  },
  viewButton: {
      fontSize: 16,
      color: 'black',
  },
  editButton: {
      fontSize: 16,
      color: 'blue',
  },
  deleteButton: {
      fontSize: 16,
      color: 'red',
  },
  emotionImage: {
      width: 30,
      height: 30,
  }
});


