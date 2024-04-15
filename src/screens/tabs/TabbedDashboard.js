import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import DashboardScreen from '../../../src/screens/tabs/DashboardScreen';
import StockMovementScreen from '../../../src/screens/tabs/StockMovementScreen';
import InventoryScreen from '../../../src/screens/tabs/InventoryScreen';
import DeliveredScreen from '../../../src/screens/tabs/DeliveredScreen';

const Tab = createBottomTabNavigator();

const TabbedDashboard = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
          labelStyle: {
            fontSize: 16,
          },
          showIcon: false, // Hide icons
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard', // Set label for Dashboard tab
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarLabel: 'Inventory', // Set label for Inventory tab
          }}
        />
        <Tab.Screen
          name="Stock"
          component={StockMovementScreen}
          options={{
            tabBarLabel: 'Stock ', // Set label for Stock Movement tab
          }}
        />
        <Tab.Screen
          name="Delivered"
          component={DeliveredScreen}
          options={{
            tabBarLabel: 'Delivered ', // Set label for Delivered Items tab
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabbedDashboard;