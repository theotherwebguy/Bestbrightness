import React from 'react';
import { View, Text } from 'react-native';

const DashboardScreen = ({ userData }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {userData && userData.name} {userData && userData.surname}</Text>
    </View>
  );
};

export default DashboardScreen;