import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Dimensions } from 'react-native';
import axios from 'axios';
import { Swipeable } from 'react-native-gesture-handler';
import StockMovementScreen from './StockMovementScreen';
const { width } = Dimensions.get('window');

const InventoryScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const flatListRef = useRef(null);

  // New state variable to track selected items
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchProducts();

    return () => {
      setSelectedItems([]);
    };

  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://172.20.48.1:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddNewItem = async () => {
    const enteredTime = new Date(); // Get current time
    console.log('Adding new item:', title, description, quantity, enteredTime);

    try {
      const response = await axios.post('http://172.20.48.1:3000/add-product', {
        title,
        description,
        quantity,
        enteredTime,
      });

      console.log('Product added successfully:', response.data);
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setQuantity('');
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedProduct) return;

    try {
      const response = await axios.put(`http://172.20.48.1:3000/products/${selectedProduct._id}`, {
        title,
        description,
        quantity,
      });

      console.log('Product updated successfully:', response.data);
      setUpdateModalVisible(false);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(`http://172.20.48.1:3000/products/${productId}`);
      console.log('Product deleted successfully:', productId);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // New function to handle selecting items
  const handleSelectItem = (item) => {
    // Check if the item is already selected
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);

    if (isSelected) {
      // If item is already selected, remove it from the selected items
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id));
    } else {
      // If item is not selected, add it to the selected items
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    }
  };
  

  const handlePickStock = async () => {
    // Update pickup time for each selected item
    selectedItems.forEach(async (item) => {
      try {
        const currentTime = new Date();
        console.log(currentTime);
        await axios.put(`http://172.20.48.1:3000/products/${item._id}`, {
          pickupTime: currentTime,
        });
      } catch (error) {
        console.error('Error updating pickup time:', error);
      }
    });
  
    // Force refresh by refetching the data from the server
    fetchProducts();
  
    // Update selectedItems with the latest data
    const updatedSelectedItems = selectedItems.map((item) => {
      return {
        ...item,
        pickupTime: new Date().toISOString(), // Assuming pickupTime is updated to current time
      };
    });
  
    // Navigate to StockMovementScreen with updated selectedItems data
    navigation.navigate('Stock Movement', { selectedItems: updatedSelectedItems });
  };

  const renderItem = ({ item }) => (
    <Swipeable 
      renderLeftActions={() => (
        <TouchableOpacity style={styles.updateButton} onPress={() => {
          setSelectedProduct(item);
          setUpdateModalVisible(true);
        }}>
            <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      )}
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item._id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
      style={[styles.item, selectedItems.some((selectedItem) => selectedItem._id === item._id) && styles.selectedItem]}
      onPress={() => handleSelectItem(item)}
      activeOpacity={0.8}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add New</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.button} onPress={handlePickStock}>
            <Text style={styles.buttonText}>Pick Stock</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
            />
            <Button title="Add" onPress={handleAddNewItem} />
          </View>
        </View>
      </Modal>
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
            />
            <Button title="Update" onPress={handleUpdateItem} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    width: '40%',
    height: 40,
    backgroundColor: '#052560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: 'lightblue', // Example background color for selected item
  },
});

export default InventoryScreen;