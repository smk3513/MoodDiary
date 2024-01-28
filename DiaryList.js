import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB as db } from './FireBaseConfig';

/* for creating flat list */
const DiaryItem = ({ diary, onDelete, onEdit, onView }) => {
  /* access to emotional images */
  const getEmotionImage = (emotionId) => {
      const emotionImages = {
          'happy': require('./images/emotion_1.png'),
          'good': require('./images/emotion_2.png'),
          'fair': require('./images/emotion_3.png'),
          'sad': require('./images/emotion_4.png'),
          'bad': require('./images/emotion_5.png'),
      };
      return emotionImages[emotionId] || null;
  };
  return (
      <View style={styles.diaryItem}>
          <Text style={styles.diaryDate}>{diary.date}</Text>
          <Image source={getEmotionImage(diary.emotion)} style={styles.emotionImage} />
          <TouchableOpacity onPress={() => onView(diary.id)}>
              <Text style={styles.viewButton}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(diary.id)}>
              <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(diary.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
    </View>
  );
};

export default function DiaryList( { navigation } ) {
  const [diaries, setDiaries] = useState([]);

  /* adding new diary : navigating to DiaryContent */
  const addDiary = () => {
    navigation.navigate('DiaryContent', { 
        newDiary: true,
    });
  };

  /* delete selected diary */
  const deleteDiary = (diary) => {
    Alert.alert(
      "Delete Diary",
      "Are you sure you want to delete this diary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const diaryRef = doc(db, 'diaries', diary.id);
            await deleteDoc(diaryRef);
          },
        }
      ]
    );
  };

  /* edit selected diary : navigating to DiaryContent */
  const editDiary = (diaryId) => {
      const diaryToEdit = diaries.find((diary) => diary.id === diaryId);
      navigation.navigate('DiaryContent', { diaryId: diaryId, diaryToEdit: diaryToEdit });
  };

  /* view selected diary detail : navigating to DiaryDetail */
  const viewDiary = (diaryId) => {
      const diaryToView = diaries.find((diary) => diary.id === diaryId);
      if (diaryToView) {
        navigation.navigate('DiaryDetail', { diary: diaryToView });
      } else {
        console.warn("Diary not found");
      }
  };

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
          <DiaryItem diary={item} onDelete={deleteDiary} onEdit={editDiary} onView={viewDiary}/>
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


