
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




// register API
require('./models/User')
const User = mongoose.model('UserInfo')

// // Use auth routes
app.get('/', (req, res) => {
    res.send({status: 'connectted'})
});
app.post('/register',async (req, res) => {
    
    try {
        const { username, password } = req.body;
    
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
    
        // Create new user
        const newUser = new User({ username, password });
        await newUser.save();
    
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.log ("Message:"+ error)
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Server error' });
      }
});

// login API
// Define login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Login successful
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
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

