/* WIll BE IMPLEMENTED LATER */
// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';

// /* access to emotional images */
// const emotions = {
//   'happy': require('./images/emotion_1.png'),
//   'good': require('./images/emotion_2.png'),
//   'fair': require('./images/emotion_3.png'),
//   'sad': require('./images/emotion_4.png'),
//   'bad': require('./images/emotion_5.png'),
// };

// const DiaryDetail = ({ route }) => {
//   // getting diary info by params
//   const { diary } = route.params;
//   const emotionImage = emotions[diary.emotion];

//   if (!diary) {
//     return (
//       <View style={styles.container}>
//         <Text>Diary not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.dateText}>{diary.date}</Text>
//       <Image source={emotionImage} style={styles.emotionImage} />
//       <Text style={styles.title}>{'Title'}</Text>
//       <Text style={styles.titleContent}>{diary.title}</Text>
//       <Text style={styles.title}>{'Content'}</Text>
//       <Text style={styles.content}>{diary.content}</Text>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   dateText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     alignSelf: 'center'
//   },
//   emotionImage: {
//     width: 300,
//     height: 300,
//     alignSelf: 'center',
//     marginBottom: 10,
//   },
//   titleContent: {
//     width: 300,
//     borderColor: 'burlywood',
//     borderRadius:10,
//     borderWidth: 1,
//     alignSelf: 'center',
//     fontSize: 24,
//     textAlign:'center',
//     marginBottom: 20,
//   },
//   title: {
//     alignSelf: 'center',
//     fontSize: 20,
//   },
//   content: {
//     height: 200,
//     width: 300,
//     borderRadius:10,
//     borderColor: 'burlywood',
//     borderWidth: 1,
//     alignSelf: 'center',
//     fontSize: 16,
//     textAlign: 'left',
//     textAlign:'center',
//   },
// });


// export default DiaryDetail; 