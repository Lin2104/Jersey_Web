// server.js

// Import 'path' for the SPA fallback
const path = require('path'); // ⬅️ FIX: Add this line
require('dotenv').config(); 
const express = require('express'); // ⬅️ Moved express import to the top
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Routers ---
const orderRoutes = require('./routes/orderRoutes'); 
const authRoutes = require('./routes/authRoutes'); // ⬅️ Using the imported variable
const productRoutes = require('./routes/productRoutes'); // ⬅️ Assuming this import exists

const app = express();
const PORT = process.env.PORT || 3000;
// const DB_URI = process.env.MONGO_URI; // DB_URI is unused

// --- Middleware ---
app.use(express.json()); 
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));

// --- API Route Mounting (CLEANED & FIXED) ---

// FIX 1: Change /api/auth to /api/admin to match the client's path preference
app.use('/api/admin', authRoutes); // ⬅️ FIX: Uses imported variable and new path

// Mounting other necessary routes
app.use('/api/orders', orderRoutes);
app.use('/api/product', productRoutes); 

// Basic Route
app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT} and connected to MongoDB.`);
});

// Health Check Route (assuming Order model is available)
app.get('/health', async (req, res) => {
    // ... (Your health check logic using mongoose.connection.readyState) ...
    // Note: You must ensure 'Order' model is required or accessible here if used.
    if (mongoose.connection.readyState === 1) {
        try {
             // Example: Find a random document from the 'orders' collection and limit the result to 1
             // You must uncomment and ensure the Order model is imported if you use this line.
             // await Order.findOne().limit(1); 
             
             res.status(200).json({ 
                 status: 'UP', 
                 database: 'CONNECTED',
                 message: 'Service and DB are healthy.'
             });
        } catch (error) {
             res.status(500).json({ 
                 status: 'DOWN', 
                 database: 'ERROR',
                 message: 'DB connection established but query failed.', 
                 error: error.message 
             });
        }
    } else {
        res.status(503).json({ 
            status: 'DOWN', 
            database: 'DISCONNECTED',
            message: 'DB is currently unavailable or connecting.'
        });
    }
});


// --- Mongoose Connection Logic ---
// ... (connectDB function, db.on listeners, etc.) ...
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!'); 
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1); 
    }
}
connectDB();
const db = mongoose.connection;
db.on('error', (error) => {
    console.error('⚠️ MongoDB runtime error:', error);
});
db.on('disconnected', () => {
    console.log('⚠️ MongoDB connection lost. Attempting to reconnect...');
});
db.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected!');
});


// ---------------------------------------------------------------------
// 🚨 FIX 2: CRITICAL SPA FALLBACK ROUTE 🚨
// This handles client-side routing and prevents 404 on direct navigation.
// ---------------------------------------------------------------------

// Define the path to your client build folder ('dist').
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'dist'); // Assumes 'dist' is at project root

// Serve the built frontend static assets (CSS, JS, images).
app.use(express.static(CLIENT_BUILD_PATH));

// Wildcard Route (Fallback) - serves index.html for any client path.
// Using '/*' avoids the PathError you saw previously.
app.get('/*', (req, res) => {
    // Only serve index.html if the URL doesn't look like an API call.
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
