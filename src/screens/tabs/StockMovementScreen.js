import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const StockMovementScreen = ({ route }) => {
  // Check if route object or selectedItems is undefined
  if (!route || !route.params || !route.params.selectedItems) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No items selected</Text>
      </View>
    );
  }

  // Extract selected items from route params
  const { selectedItems } = route.params;

  // Render function for each item in the FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Selected Items</Text>
      <FlatList
        data={selectedItems}
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
});

export default StockMovementScreen;