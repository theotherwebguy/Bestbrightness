import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const StockMovementScreen = ({ userData }) => {
  const [pickedStock, setPickedStock] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(fetchPickedStock, 3000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchPickedStock = async () => {
    try {
      const response = await axios.get('http://192.168.240.1:3000/picked-stock?longPoll=true');
      setPickedStock(response.data.filter(item => item.loggedUserID === userData.id));
    } catch (error) {
      console.error('Error fetching picked stock:', error);
      // Handle error
    }
  };

  const handleSelectItem = (item) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);
    if (isSelected) {
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id));
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    }
  };

  // Function to Deliver picked items
  const handleDeliver = async () => {
    try {
      // Add each selected item one by one
      await Promise.all(selectedItems.map(async (item) => {
        // Transform the item into an object matching the schema
        const deliveredItem = {
          productID: item.productID,
          loggedUserID: userData.id,
          role: userData.role,
          deliveredQuantity: item.pickedQuantity,
          stockEnteredTime: new Date(),
          pickedUpTime: item.pickupTime,
          deliveredTime: new Date(), // Assuming delivered time is current time
        };
  
        // Send a POST request to add the item
        await axios.post('http://192.168.240.1:3000/add-delivered-stock', deliveredItem);
      }));
  
      // Delete each selected item one by one
      await Promise.all(selectedItems.map(async (item) => {
        // Send a DELETE request to delete the item
        await axios.delete(`http://192.168.240.1:3000/picked-stock/${item._id}`);
      }));
  
      // Clear selected items after delivery
      setSelectedItems([]);
    } catch (error) {
      console.error('Error delivering stock:', error);
      // Handle error
    }
  };
  
  

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);
    return (
      <TouchableOpacity onPress={() => handleSelectItem(item)}>
        <View style={[styles.item, isSelected ? {backgroundColor: '#ADD8E6'} : null]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.quantity}> Quantity: {item.pickedQuantity}</Text>
          <Text style={styles.pickedTime}>Picked Time: {item.pickupTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi: {userData.name} Pick Item for Delivery</Text>
      <FlatList
        data={pickedStock}
        renderItem={renderItem}
        keyExtractor={(item) => item._id} 
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.button} onPress={handleDeliver}>
        <Text style={styles.buttonText}>Deliver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  quantity: {
    fontSize: 16,
  },
  pickedTime: {
    fontSize: 16,
  },
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#052560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default StockMovementScreen;
