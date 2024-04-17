import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DeliveredScreen = ({ route }) => {
  // Extract delivered items from route params
  const deliveredItems = route.params?.deliveredItems || [];

  // Render function for each item in the FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.pickupTime}>Pickup Time: {item.pickupTime ? new Date(item.pickupTime).toLocaleString() : 'Not Picked Up'}</Text>
    </View>
  );

  // Check if there are delivered items
  if (deliveredItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No items to deliver</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delivered Items</Text>
      <FlatList
        data={deliveredItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  quantity: {
    color: '#888',
  },
  pickupTime: {
    color: '#888',
  },
});

export default DeliveredScreen;