import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Dimensions } from 'react-native';
import axios from 'axios';
import { Swipeable } from 'react-native-gesture-handler';
import StockMovementScreen from './StockMovementScreen';
import DashboardScreen from './DashboardScreen';
import { IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const InventoryScreen = ({ navigation, userData }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const flatListRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pickStockModalVisible, setPickStockModalVisible] = useState(false);
  const [pickedQuantity, setPickedQuantity] = useState('');
  const [lowStockItems, setLowStockItems] = useState([]);
  const loggedInUserID = userData.id
  const role = userData && userData.role


  useEffect(() => {
    fetchProducts();
    fetchProductsAndCalculateLowStock();
    return () => {
      setSelectedItems([]);
    };
  }, []);

  
  const fetchProductsAndCalculateLowStock = async () => {
    try {
      const response = await axios.get('http:172.31.160.1:3000/products?longPoll=true');
      const fetchedProducts = response.data;
      setProducts(fetchedProducts);
  
      // Calculate low stock items
      const lowStock = calculateLowStockItems(fetchedProducts);
      console.log("Low Stock in Inventory:", lowStock);
      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

    // Function to calculate low stock items
    const calculateLowStockItems = (products) => {
      // Define your threshold for low stock
      const threshold = 50;
      return products.filter(item => item.quantity < threshold);
    };

  // Fetch Products from DB
  async function fetchProducts() {
    try {
      const response = await axios.get('http:172.31.160.1:3000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  const handleAddNewItem = async () => {
    const enteredTime = new Date();
    try {
      const response = await axios.post('http:172.31.160.1:3000/add-product', {
        title,
        description,
        quantity: parseInt(quantity),
        enteredTime,
      });
      
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setQuantity('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Function to update Product
  const handleUpdateItem = async () => {
    if (!selectedProduct) return;
    try {
      const response = await axios.put(`http:172.31.160.1:3000/products/${selectedProduct._id}`, {
        title,
        description,
        quantity: parseInt(quantity),
      });
      console.log('Product updated successfully:', response.data);
      setUpdateModalVisible(false);
      fetchProducts();
      fetchProductsAndCalculateLowStock();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Function to Delete a product
  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(`http:172.31.160.1:3000/products/${productId}`);
      console.log('Product deleted successfully:', productId);
      fetchProducts();
      fetchProductsAndCalculateLowStock();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to select a product
  const handleSelectItem = (item) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);
    if (isSelected) {
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id));
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    }
  };

 // Function to pick stock
 const handlePickStock = async (loggedInUserID, role) => {
  
  selectedItems.forEach(async (item) => {
    try {
      // Call the route to add picked stock
      await axios.post('http:172.31.160.1:3000/add-picked-stock', {
        title: item.title,
        description: item.description,
        productID: item._id,
        loggedUserID: loggedInUserID,
        role: role,
        pickedQuantity: pickedQuantity,
        pickupTime: new Date(),
      });
    } catch (error) {
      console.error('Error adding picked stock:', error);
    }
  });

  // Do not navigate to Stock Movement screen
  setPickStockModalVisible(false);
};

// Function to confirmStock quantity
const confirmPickStock = async (loggedInUserID, role) => {

   // Ensure that at least one item is selected
   if (selectedItems.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  // Function to select all items before picking stock
  selectedItems.forEach((item) => {
    handleSelectItem(item); // Call handleSelectItem to ensure all items are selected
  });


  const totalAvailableStock = selectedItems.reduce((total, item) => total + item.quantity, 0);

  
  if (pickedQuantity > totalAvailableStock) {
    alert("Entered quantity exceeds available stock. Please enter a number below or equal to the available stock.");
    return;
  }
  try {
    for (const item of selectedItems) {
      const updatedQuantity = item.quantity - pickedQuantity;
      await axios.put(`http:172.31.160.1:3000/products/${item._id}`, {
        quantity: updatedQuantity,
      });
    }
    fetchProducts();
    handlePickStock(loggedInUserID, role); // Call handlePickStock to save the selected stock data
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={() => (
        role !== "Picker" ? // Check if the role is not "Picker"
        <TouchableOpacity style={styles.updateButton} onPress={() => {
          setSelectedProduct(item);
          setUpdateModalVisible(true);
        }}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity> : null // Render null if the role is "Picker"
      )}
      renderRightActions={() => (
        role !== "Picker" ? // Check if the role is not "Picker"
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item._id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity> : null // Render null if the role is "Picker"
      )}
    >
      <View style={[styles.itemContainer, selectedItems.some((selectedItem) => selectedItem._id === item._id) && styles.selectedItem]}>
        <View style={styles.itemDetails}>
          <TouchableOpacity
            style={[styles.item]}
            onPress={() => handleSelectItem(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.plusIconContainer}>
          <IconButton
            icon="plus"
            color="#052560"
            size={24}
            onPress={() => setPickStockModalVisible(true)}
          />
        </View>
      </View>
    </Swipeable>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add New</Text>
        </TouchableOpacity>

      </View>

      <FlatList
        ref={flatListRef}
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

          {/* Display total stock */}
    <View style={styles.totalStockContainer}>
      <Text style={styles.totalStockText}>Total Stock: {products.reduce((total, item) => total + item.quantity, 0)}</Text>
    </View>

    {/* Display list of items with low stock */}
    <View style={styles.lowStockContainer}>
      <Text style={styles.lowStockTitle}>Items with Low Stock:</Text>
      {lowStockItems.map((item) => (
        <View key={item._id} style={styles.lowStockItem}>
          <Text style={styles.lowstockfont}>{item.title}: {item.quantity}</Text>
        </View>
      ))}
    </View>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={pickStockModalVisible}
        onRequestClose={() => setPickStockModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Quantity"
              keyboardType="numeric"
              value={pickedQuantity}
              onChangeText={text => setPickedQuantity(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => confirmPickStock(loggedInUserID, role)}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setPickStockModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    width: '80%',
    height: 40,
    backgroundColor: '#052560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  item: {
    marginBottom: 10,
    padding: 10,
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
    backgroundColor: 'lightblue',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#052560',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemDetails: {
    width: '80%',
  },
  plusIconContainer: {
    width: '20%',
    alignItems: 'center',
  },
  totalStockContainer: {
    marginTop: 20,
    alignItems: 'start',
  },
  totalStockText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lowStockContainer: {
    marginTop: 20,
  },
  lowStockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lowStockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    
  },
  lowstockfont: {
    fontSize:18,
    color: 'red',
    fontWeight: 'bold',
  }
});

export default InventoryScreen;
