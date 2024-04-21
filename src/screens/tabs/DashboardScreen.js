import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DashboardScreen = ({ userData }) => {
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {userData && userData.name} {userData && userData.surname}</Text>
      <Text>Low Stock Items:</Text>
      <FlatList
        data={lowStockItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Quantity: {item.quantity}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});

export default DashboardScreen;
