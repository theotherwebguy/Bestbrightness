
const express = require('express');
const connectDB = require('./config/db');
const { default: mongoose } = require("mongoose");
// const authRoutes = require('./routes/auth');
const cors = require('cors'); 
const { networkInterfaces } = require('os');


// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Use JSON middleware
app.use(express.json());

// Use CORS middleware
app.use(cors());


// Routes Impirts
require('./models/User')
const User = mongoose.model('UserInfo')


require('./models/Product')
const Product = mongoose.model('Product')

require('./models/PickedStock');
const PickedStock = mongoose.model('PickedStock')

require('./models/DeliveredStock')
const DeliveredStock = mongoose.model('DeliveredStock')


// // Use auth routes
app.get('/', (req, res) => {
    res.send({status: 'connectted'})
});

// Register route
// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password, name, surname, email, role } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = new User({ username, password, name, surname, email, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ username });

        // Log the retrieved user object
        console.log('Retrieved User:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password (You should use bcrypt or another secure method for password hashing)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Login successful, return user information
    res.status(200).json({
      message: 'Login successful',
      user: { 
        id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        role: user.role,

      } 
    });

    // Log the user data
    console.log('User Data Backend:', user.role);

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define add product route
app.post('/add-product', async (req, res) => {
  const { title, description, quantity, enteredTime } = req.body;

  try {
    // Create new product
    const newProduct = new Product({ title, description, quantity, enteredTime });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define get products route
app.get('/products', async (req, res) => {
  try {
    const longPoll = req.query.longPoll === 'true';

    if (longPoll) {
      // Set a timeout to simulate long polling
      setTimeout(async () => {
        const products = await Product.find();
        res.json(products);
      }, 10); // Polling interval: 5 seconds
    } else {
      // Normal request, respond immediately with the current data
      const products = await Product.find();
      res.json(products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route to update a product
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { title, description, quantity, enteredTime, pickupTime, deliveredTime} = req.body;

  try {
      // Find the product by ID and update its fields
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
          title,
          description,
          quantity,
          enteredTime,
          pickupTime,
          deliveredTime
      }, { new: true });

      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Define route to get a product with ID
app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route to delete a product
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
      // Find the product by ID and delete it
      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Define route to add picked stock
app.post('/add-picked-stock', async (req, res) => {
  const { title, description, productID, loggedUserID, role, pickedQuantity } = req.body;

  try {
    // Create new picked stock entry
    const newPickedStock = new PickedStock({ title, description, productID, loggedUserID, role, pickedQuantity });
    await newPickedStock.save();

    res.status(201).json({ message: 'Picked stock added successfully' });
  } catch (error) {
    console.error('Error adding picked stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define route to add delivered stock
app.post('/add-delivered-stock', async (req, res) => {
  const { productID, loggedUserID, role, deliveredQuantity } = req.body;

  try {
    // Create new delivered stock entry
    const newDeliveredStock = new DeliveredStock({ productID, loggedUserID, role, deliveredQuantity });
    await newDeliveredStock.save();

    res.status(201).json({ message: 'Delivered stock added successfully' });
  } catch (error) {
    console.error('Error adding delivered stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Function to get the IP address
function getIPAddress() {
    const interfaces = networkInterfaces();
    for (const interfaceName in interfaces) {
      const interfaceInfo = interfaces[interfaceName];
      for (const iface of interfaceInfo) {
        // Skip over internal (non-IPv4) and non-external (i.e., 127.0.0.1) addresses
        if (!iface.internal && iface.family === 'IPv4') {
          return iface.address;
        }
      }
    }
    return null; // Return null if no IP address found
  }
  
  const IP_ADDRESS = getIPAddress() 
  console.log(IP_ADDRESS)

// Start server
const PORT = process.env.PORT || 3000;
const HOST = IP_ADDRESS; // Define localhost address

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
