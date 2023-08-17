const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Connect to the MongoDB database
const uri = process.env.DATABASE;
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = {
  connectToDatabase
};