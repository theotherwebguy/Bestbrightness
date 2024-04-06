import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/Auth/Login';
import SignUpScreen from './src/screens/Auth/SignUp';
import TabbedDashboard from './src/screens//tabs/TabbedDashboard'; // Import TabbedDashboard component
import DashboardScreen from './src/screens/tabs/DashboardScreen';
import InventoryScreen from './src/screens/tabs/InventoryScreen';
import StockMovementScreen from './src/screens/tabs/StockMovementScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack({ setIsLoggedIn }: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Stock Movement" component={StockMovementScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to change isLoggedIn state upon successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainApp /> // Render TabbedDashboard if logged in
      ) : (
        <AuthStack setIsLoggedIn={setIsLoggedIn} /> // Pass setIsLoggedIn as a prop
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;