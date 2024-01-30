import { View, Text, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from './FireBaseConfig';
import { TextInput } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ( {navigation} ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;
    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error)
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
            navigation.navigate('DiaryList', {});
        }
    }
    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Sign up suceed!');
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <Text style={styles.title}> Please sign in first before you started!</Text>
                <TextInput
                    style={{
                        marginVertical: 4,
                        height: 50,
                        borderWidth: 1,
                        borderRadius: 6,
                        padding: 10,
                        backgroundColor: '#fff'
                    }}
                    value={email}
                    placeholder='Email' 
                    autoCapitalize='none' 
                    onChangeText={(text) => setEmail(text)}>
                </TextInput>
                <TextInput
                    style={{
                        marginVertical: 4,
                        height: 50,
                        borderWidth: 1,
                        borderRadius: 6,
                        padding: 10,
                        backgroundColor: '#fff'
                    }}
                    secureTextEntry={true}
                    value={password}
                    placeholder='Password' 
                    autoCapitalize='none' 
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                {
                    loading ? <ActivityIndicator size="large" color="#0000ff" /> : 
                    <>
                        <Button 
                            title="Sign In" 
                            onPress={signIn} />
                        <Text style={styles.content}>You don't have an account yet?</Text>
                        <Button 
                            title="Sign up" 
                            onPress={signUp} />
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'beige',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginBottom: 20
    },
    content: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 18,
    }
});
  
export default Login;