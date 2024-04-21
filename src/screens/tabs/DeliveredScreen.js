import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const DeliveredScreen = ({ userData }) => {
  const [deliveredStock, setDeliveredStock] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(fetchDeliveredStock, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchDeliveredStock = async () => {
    try {
      const response = await axios.get('http://192.168.240.1:3000/delivered-stock?longPoll=true');
      const filteredData = response.data.filter(item => item.loggedUserID === userData.id);
      setDeliveredStock(filteredData);
    } catch (error) {
      console.error('Error fetching delivered stock:', error);
      // Handle error
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.quantity}>Quantity: {item.deliveredQuantity}</Text>
      <Text style={styles.time}>Delivered Time: {item.deliveredTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hi {userData.name}, Delivered Stock</Text>
      <FlatList
        data={deliveredStock}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  time: {
    fontSize: 16,
  },
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
});

export default DeliveredScreen;
