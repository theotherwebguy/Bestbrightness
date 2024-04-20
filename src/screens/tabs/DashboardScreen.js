import React from 'react';
import { View, Text } from 'react-native';

const DashboardScreen = ({ userData }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center',fontSize: 44,alignItems: 'center',fontWeight: 'bold' }}>
      <Text>Welcome, {userData && userData.name} {userData && userData.surname} Role: {userData && userData.role}</Text>
    </View>
  );
};

export default DashboardScreen;