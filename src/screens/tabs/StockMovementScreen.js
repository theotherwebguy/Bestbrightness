import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';

const StockMovementScreen = ({ route, navigation }) => {
  // New state to manage selected items
  const [selectedItems, setSelectedItems] = useState(route.params.selectedItems.map(item => ({ ...item, selected: false })));

  useEffect(() => {
    // Check if there are selectedItems passed as route params
    if (route.params && route.params.selectedItems) {
      // Initialize selectedItems state with the selected items passed from InventoryScreen
      setSelectedItems(route.params.selectedItems.map(item => ({ ...item, selected: false })));
    }
  }, [route.params]);

  // Function to toggle item selection
  const toggleSelectItem = (itemId) => {
    const updatedItems = selectedItems.map(item => {
      if (item._id === itemId) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setSelectedItems(updatedItems);
  };

  // Function to handle delivery of selected items
  const handleDeliver = async () => {
    // Filter selected items
    const deliveredItems = selectedItems.filter(item => item.selected);

    // Remove delivered items from selectedItems state
    const updatedItems = selectedItems.filter(item => !item.selected);
    setSelectedItems(updatedItems);

    // Navigate to DeliverItemsScreen with selected items data
    navigation.navigate('Delivere Items', { deliveredItems });
  };

  // Render function for each item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleSelectItem(item._id)}
      style={[styles.item, item.selected && styles.selectedItem]} // Apply selected style if item is selected
      activeOpacity={0.8}
    >
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.pickupTime}>Pickup Time: {item.pickupTime ? new Date(item.pickupTime).toLocaleString() : 'Not Picked Up'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* New button container */}
      <View style={styles.buttonContainer}>
        <Button title="Deliver" color="#052560" onPress={handleDeliver} />
      </View>
      {/* Old code: heading and FlatList for selected items */}
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
  buttonContainer: {
    width: '100%',
    height: 40,
    backgroundColor: '#052560', // Green color for deliver button
    justifyContent: 'center',
    alignItems: 'center',
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
  selectedItem: {
    backgroundColor: 'lightblue', // Example background color for selected item
  },
});

export default StockMovementScreen;