import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TextInput } from 'react-native';
import { launchCamera } from 'react-native-image-picker'; // Import launchCamera function from react-native-image-picker

const InventoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false); // State to control the visibility of the modal
  const [title, setTitle] = useState(''); // State to capture item title in modal
  const [description, setDescription] = useState(''); // State to capture item description in modal
  const [quantity, setQuantity] = useState(''); // State to capture item quantity in modal

  // Function to handle opening camera for quick add
  const handleQuickAdd = () => {
    // Implement camera capture functionality using react-native-image-picker library
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        // Image captured successfully, you can handle further processing here
        console.log('Image captured:', response);
      }
    });
  };

  // Function to handle adding new item via modal
  const handleAddNewItem = () => {
    // Implement functionality to add new item here
    console.log('Adding new item:', title, description, quantity);
    // Close modal after adding item
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Horizontal buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Add New" onPress={() => setModalVisible(true)} />
        <Button title="Quick Add" onPress={handleQuickAdd} />
      </View>

      {/* FlatList of inventory items */}
      {/* Display inventory items here */}

      {/* Modal for adding new item */}
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
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
});

export default InventoryScreen;