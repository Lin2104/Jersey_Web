// server.js (UPDATED to use the Router)

// server.js (MUST BE THE FIRST LINE)
require('dotenv').config(); 
// ...const express = require('express');
const mongoose = require('mongoose');
// const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // ⬅️ The package name is 'cors'// ⚠️ Import the new router file
const orderRoutes = require('./routes/orderRoutes'); 
const express = require('express'); // ⬅️ MAKE SURE THIS LINE IS PRESENT
const path = require('path');
const app = express();
const authRoutes = require('./routes/authRoutes'); // ⬅️ New Import
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI; 
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'dist');

// Step 1: Configure Express to serve your built frontend static assets (CSS, JS, images).

app.use(express.json()); 
app.use(express.static(CLIENT_BUILD_PATH));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors()); // This allows requests from ANY origin.
app.use(express.urlencoded({ extended: true }));
// app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/authRoutes'));// server.js (THE CORRECT LINE)
app.use('/api/orders', require('./routes/orderRoutes'));

app.use('/api/product', require('./routes/productRoutes')); // ⬅️ ADD THIS LINE


// server.js

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // This log confirms the initial connection was successful
        console.log('✅ MongoDB connected successfully!'); 
    } catch (error) {
        // This log confirms the initial connection failed
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1); 
    }
}
connectDB();
// server.js

// Get the default connection object
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('⚠️ MongoDB runtime error:', error);
});

db.on('disconnected', () => {
    console.log('⚠️ MongoDB connection lost. Attempting to reconnect...');
    // You could place reconnection logic here if needed
});

db.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected!');
});

// --- Connect the Order Routes ---
// All requests starting with '/api/orders' will be handled by orderRoutes
app.use('/api/orders', orderRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT} and connected to MongoDB.`);
});
// server.js (or a separate health check route file)

app.get('/health', async (req, res) => {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState === 1) {
        try {
            // Option A: Quick Mongoose check (faster)
            // Perform a light query to ensure the DB itself is responding.
            // Example: Find a random document from the 'orders' collection and limit the result to 1
            await Order.findOne().limit(1); 
            
            // Option B: Native driver check (also works)
            // await mongoose.connection.db.command({ ping: 1 });

            res.status(200).json({ 
                status: 'UP', 
                database: 'CONNECTED',
                message: 'Service and DB are healthy.'
            });
        } catch (error) {
            // Handle cases where Mongoose thinks it's connected, but the query fails
            res.status(500).json({ 
                status: 'DOWN', 
                database: 'ERROR',
                message: 'DB connection established but query failed.', 
                error: error.message 
            });
        }
    } else {
        // Mongoose connection state is not 'connected' (i.e., 0, 2, or 3)
        res.status(503).json({ 
            status: 'DOWN', 
            database: 'DISCONNECTED',
            message: 'DB is currently unavailable or connecting.'
        });
    }
});
app.get('/*', (req, res) => {
    // We only serve index.html if the URL doesn't look like an API call.
    if (!req.originalUrl.startsWith('/api/')) {
        res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
    } else {
        // If it looks like an API route but was missed, return a final 404.
        res.status(404).send('API endpoint not found.');
    }
});
// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`📡 Server listening on http://localhost:${PORT}`);
});
