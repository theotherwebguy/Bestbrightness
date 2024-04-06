import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios'; // Import Axios for HTTP requests

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSignUp = async () => {
    try {
      // Send a POST request to the backend API with username and password
      const response = await axios.post('http://192.168.8.192:3000/register', {
        username,
        password,
      });

      // Check if sign-up was successful
      if (response.status === 201) {
        // Alert the user that sign-up was successful
        Alert.alert('Success', 'User created successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }, // Navigate to login screen
        ]);
      }
    } catch (error) {
      // Handle sign-up error
      console.log('Message:'+error)
      console.error('Error signing up:', error);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/b-logo.png')} style={styles.logo} />
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#052560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default SignUpScreen;