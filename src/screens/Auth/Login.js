import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation, setIsLoggedIn, setUserData }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Send a POST request to the backend API wit++h username and password
      const response = await axios.post('http:192.168.208.1:3000/login', {
        username,
        password,
      });

      // Check if login was successful
      if (response.status === 200) {
        // Extract user data from the response
        const { id, name, surname, role } = response.data.user;
        
        console.log('User Data Role:', role );
        // Set user data in state
        setUserData({ id, name, surname, role });

        // Set isLoggedIn to true upon successful login
        setIsLoggedIn(true);
        
        // Log all user information extracted
        console.log('User Data:', { id, name, surname,role });

      } else {
        
        Alert.alert('Error', response.data.message || 'Failed to login. Please try again.');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text></Text>
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
  signUpText: {
    marginTop: 10,
    fontSize: 16,
  },
  signUpLink: {
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;