
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import LoginScreen from './src/screens/Auth/Login';
import SignUpScreen from './src/screens/Auth/SignUp';
import DashboardScreen from './src/screens/tabs/DashboardScreen';
import InventoryScreen from './src/screens/tabs/InventoryScreen';
import DeliveredScreen from './src/screens/tabs/DeliveredScreen';
import StockMovementScreen from './src/screens/tabs/StockMovementScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack({ setIsLoggedIn, setUserData }: 
  { setIsLoggedIn: (isLoggedIn: boolean) => void; setUserData: (data: any) => void }) {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

 function MainApp({ userData }) {

  return (
    <Tab.Navigator>

      <Tab.Screen 
        name="Inventory" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('C:/Users/NdlelaM/Documents/App1/Bestbrightness/assets/inventory_icon.png')}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }} 
      >
        {(props) => <InventoryScreen {...props} userData={userData} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Stock Movement" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('C:/Users/NdlelaM/Documents/App1/Bestbrightness/assets/stock_movement_icon.png')}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      >
        {(props) => <StockMovementScreen {...props} userData={userData} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Delivered Items"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('C:/Users/NdlelaM/Documents/App1/Bestbrightness/assets/delivered_items_icon.png')}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      >
        {(props) => <DeliveredScreen {...props} userData={userData} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainApp userData={userData}  />
        ) : (
          <AuthStack setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;