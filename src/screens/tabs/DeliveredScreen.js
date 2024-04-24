import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Print from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const DeliveredScreen = ({ userData }) => {
  const [deliveredStock, setDeliveredStock] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(fetchDeliveredStock, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchDeliveredStock = async () => {
    try {
      const response = await axios.get('http:172.31.160.1:3000/delivered-stock?longPoll=true');
      const filteredData = response.data.filter(item => item.loggedUserID === userData.id);
      setDeliveredStock(filteredData);
    } catch (error) {
      console.error('Error fetching delivered stock:', error);
      // Handle error
    }
  };

  const handlePrintSlip = async () => {
    const htmlContent = generateSlipContent();
  
    try {
      // Generate PDF from HTML content
      const { filePath } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'delivered_stock_slip',
        directory: 'Documents',
      });
  
      // Print the PDF
      await Print.print({ filePath });
    } catch (error) {
      console.error('Error printing slip:', error);
    }
  };
  

  const generateSlipContent = () => {
    let html = `<html><body><h1>Delivered Stock Slip</h1>`;
    html += `<p>Name: ${userData.name}</p>`;
    deliveredStock.forEach(item => {
      html += `<div style="margin-bottom: 20px;">
                <p><strong>Title:</strong> ${item.title}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Quantity:</strong> ${item.deliveredQuantity}</p>
                <p><strong>Picked Up Time:</strong> ${item.pickupTime}</p>
                <p><strong>Delivered Time:</strong> ${item.deliveredTime}</p>
              </div>`;
    });
    html += `</body></html>`;
    return html;
    console.log(html);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.quantity}>Quantity: {item.deliveredQuantity}</Text>
      <Text style={styles.time}>Pickup Time: {item.stockEnteredTime}</Text>
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
      <TouchableOpacity style={styles.button} onPress={handlePrintSlip}>
        <Text style={styles.buttonText}>Print Slip</Text>
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

export default DeliveredScreen;
