import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import DashboardScreen from '../../../src/screens/tabs/DashboardScreen';
import StockMovementScreen from '../../../src/screens/tabs/StockMovementScreen';
import InventoryScreen from '../../../src/screens/tabs/InventoryScreen';

const Tab = createBottomTabNavigator();

const TabbedDashboard = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Stock Movement" component={StockMovementScreen} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabbedDashboard;