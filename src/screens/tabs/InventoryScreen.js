import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Dimensions } from 'react-native';
import { launchCamera } from 'react-native-image-picker';


const { width } = Dimensions.get('window');

const InventoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleQuickAdd = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        console.log('Image captured:', response);
      }
    });
  };

  const handleAddNewItem = () => {
    console.log('Adding new item:', title, description, quantity);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          {/* <Button title="Add New" onPress={() => setModalVisible(true)} /> */}
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
           <Text style={styles.buttonText}>Add New</Text>
          </TouchableOpacity>
        </View>

      </View>

      <FlatList
        data={[]} // Add your inventory items data here
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
            {/* Display other item details as needed */}
          </View>
        )}
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
    // alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#052560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40, // Full screen width minus padding
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
  modalButton: {
    backgroundColor: '#052560',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 40,
  },
});

export default InventoryScreen;