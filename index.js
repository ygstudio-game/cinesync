const connectDB = require('./db');
require('./postgresql'); // Just importing will trigger the connection test

// Connect to DB
connectDB();
