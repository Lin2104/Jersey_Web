// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const path = require('path');

// // Using path.join for robust, cross-platform file path resolution
// const User = require(path.join(__dirname, '..', 'models', 'User')); 

// const router = express.Router();

// // Get secret key from environment variables
// const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-default-key-for-development'; 
// const JWT_LIFESPAN = '30d';

// // Helper function to generate the JWT
// const generateToken = (id, role) => {
//     return jwt.sign({ id, role }, JWT_SECRET, {
//         expiresIn: JWT_LIFESPAN,
//     });
// };

// // -----------------------------------------------------------------
// // Route: POST /api/auth/register (Create User)
// // --- Registration remains correct as the password is set during User.create() ---
// // -----------------------------------------------------------------
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, role } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ message: 'Please provide both username and password.' });
//         }

//         const userExists = await User.findOne({ username });
//         if (userExists) {
//             return res.status(400).json({ message: 'User already exists.' });
//         }

//         // Note: Password hashing is usually handled automatically by the pre-save hook in User.js.
//         // If you remove the pre-save hook, use the manual hash logic shown below.

//         // If you are NOT using the Mongoose pre-save hook, uncomment this:
//         /*
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         */
       
//         // Create the user
//       const newUser = await User.create({
//     username,
//     password: password, // ⬅️ Plain password passed to trigger the pre('save') hook
//     role: role === 'admin' ? 'admin' : 'user',
// });
        
//         // Respond with success and the JWT
//         res.status(201).json({
//             _id: newUser._id,
//             username: newUser.username,
//             role: newUser.role,
//             token: generateToken(newUser._id, newUser.role),
//         });

//     } catch (error) {
//         console.error('Registration Error:', error);
//         res.status(500).json({ message: 'Internal Server Error during registration.' });
//     }
// });

// // -----------------------------------------------------------------
// // Route: POST /api/auth/login (Login and Get JWT)
// // -----------------------------------------------------------------
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // 1. Find user by username AND explicitly SELECT the hidden password field
// const user = await User.findOne({ username }).select('+password');        // ⬅️ FIX: The crucial .select('+password')

//         // 2. Check if user exists AND if password matches
// if (user && (await bcrypt.compare(password, user.password))) {            // Success: Respond with user details and JWT
//             res.json({
//                 _id: user._id,
//                 username: user.username,
//                 role: user.role,
//                 token: generateToken(user._id, user.role),
//             });
//         } else {
//             // Failure
//             res.status(401).json({ message: 'Invalid credentials.' });
//         }

//     } catch (error) {
//         console.error('Login Error:', error);
//         res.status(500).json({ message: 'Internal Server Error during login.' });
//     }
// });

// module.exports = router;

// routes/authRoutes.js

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// const User = require('../models/User'); // Import the User model
// // Assuming bcryptjs for password comparison
// // const bcrypt = require('bcryptjs'); 

// // Get the secret key
// const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-default-key-for-development';

// // Helper function to generate the token
// const generateToken = (id, role) => {
//     return jwt.sign({ id, role }, JWT_SECRET, {
//         expiresIn: '30d',
//     });
// };

// // POST /api/auth/login
// const loginAdmin = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // 1. Find the user by username (or email, depending on your setup)
//         const user = await User.findOne({ username }); // or { email: username }

//         // 2. Check if user exists and if the password is correct
//         // In a real application, you would use: await bcrypt.compare(password, user.password)
        
//         // --- TEMPORARY MOCK CHECK (Replace with real logic) ---
//         // Since you mentioned the credentials are in the DB, this logic is mandatory.
        
//         if (user && user.role === 'admin' /* && (await bcrypt.compare(password, user.password)) */) {
            
//             // --- ACTUAL LOGIC IF PASSWORD MATCHES ---
//             const token = generateToken(user._id, user.role);
            
//             res.json({
//                 _id: user._id,
//                 username: user.username,
//                 role: user.role,
//                 token: token, 
//             });
//         } else {
//             // User not found, or password/role is incorrect
//             res.status(401).json({ message: 'Invalid credentials or user is not an admin.' });
//         }
        
//     } catch (error) {
//         console.error("Admin Login Error:", error);
//         res.status(500).json({ message: 'Server error during login process.' });
//     }
// };

// router.post('/login', loginAdmin);

// module.exports = router;



// routes/authRoutes.js (Verified and ready for mounting)

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

// Using path.join for robust, cross-platform file path resolution
const User = require(path.join(__dirname, '..', 'models', 'User')); 

const router = express.Router();

// Get secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-default-key-for-development'; 
const JWT_LIFESPAN = '30d';

// Helper function to generate the JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: JWT_LIFESPAN,
    });
};

// -----------------------------------------------------------------
// Route: POST /api/auth/register (Create User)
// -----------------------------------------------------------------
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide both username and password.' });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        
        // Create the user
        const newUser = await User.create({
            username,
            password: password, 
            role: role === 'admin' ? 'admin' : 'user',
        });
        
        // Respond with success and the JWT
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            token: generateToken(newUser._id, newUser.role),
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal Server Error during registration.' });
    }
});

// -----------------------------------------------------------------
// Route: POST /api/auth/login (Login and Get JWT)
// -----------------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find user by username AND explicitly SELECT the hidden password field
        const user = await User.findOne({ username }).select('+password'); 

        // 2. Check if user exists AND if password matches
        if (user && (await bcrypt.compare(password, user.password))) { 
            // Success: Respond with user details and JWT
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            // Failure
            res.status(401).json({ message: 'Invalid credentials.' });
        }

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error during login.' });
    }
});

module.exports = router;