import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DiaryList from './DiaryList';
import Home from './Home';
import DiaryContent from './DiaryContent';
import DiaryDetail from './DiaryDetail';
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH as auth} from './FireBaseConfig';

const Stack = createStackNavigator();

export default function App({ navigation }) {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function handleUserChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleUserChange);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DiaryList"
          component={DiaryList}
          options={{}}
        />
        <Stack.Screen
          name="DiaryContent"
          component={DiaryContent}
        />
        <Stack.Screen
          name="DiaryDetail"
          component={DiaryDetail}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
