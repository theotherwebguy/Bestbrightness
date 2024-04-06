const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://msizindlela5:TfEJOV8zImlb7Gbb@bbdb.e14vhn9.mongodb.net/';

// Establish MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // process.exit(1);
  }
};

module.exports = connectDB;