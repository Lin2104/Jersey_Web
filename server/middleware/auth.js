// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Required to fetch the user if needed

// // Get the secret key from environment variables
// const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-default-key-for-development';

// /**
//  * @desc Middleware to check for a valid JWT and attach user data to the request
//  * @name protect
//  * @returns {void}
//  */
// const protect = async (req, res, next) => {
//     let token;

//     // 1. Check if the Authorization header exists and starts with 'Bearer'
//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         try {
//             // Extract the token (e.g., "Bearer <token>" -> "<token>")
//             token = req.headers.authorization.split(' ')[1];

//             // 2. Verify the token using the secret key
//             const decoded = jwt.verify(token, JWT_SECRET);

//             // 3. Attach the user's ID and role from the token payload to the request
//             // We attach the ID to allow route handlers to perform database queries specific to the user.
//             req.user = decoded; 
            
//             next();
//         } catch (error) {
//             console.error('Token verification error:', error.message);
//             return res.status(401).json({ message: 'Not authorized, token failed.' });
//         }
//     }

//     // 4. If no token is found in the header
//     if (!token) {
//         return res.status(401).json({ message: 'Not authorized, no token.' });
//     }
// };


// /**
//  * @desc Middleware to restrict access based on user role
//  * @name restrictTo
//  * @param {...string} allowedRoles - A list of roles that are allowed access (e.g., 'admin', 'manager')
//  * @returns {function} The middleware function
//  */
// const restrictTo = (...allowedRoles) => {
//     // This returns the actual middleware function for Express
//     return (req, res, next) => {
//         // req.user is set by the 'protect' middleware, which must run first.
//         if (!req.user || !req.user.role) {
//              return res.status(403).json({ message: 'Forbidden: Role information missing.' });
//         }

//         // Check if the user's role is included in the list of allowed roles
//         if (!allowedRoles.includes(req.user.role)) {
//             return res.status(403).json({ 
//                 message: `Forbidden: User role '${req.user.role}' is not allowed to access this resource.` 
//             });
//         }
        
//         next();
//     };
// };

// module.exports = { protect, restrictTo };

// middleware/auth.js

const jwt = require('jsonwebtoken');
// FIX: Ensure the User model is correctly imported for fetching user data
const User = require('../models/User'); 

// Get the secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-default-key-for-development';

/**
 * @desc Middleware to check for a valid JWT and attach user data (ID, Role, and optionally the full User document) to the request.
 * @name protect
 * @returns {void}
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token (e.g., "Bearer <token>" -> "<token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the secret key
            const decoded = jwt.verify(token, JWT_SECRET);

            // 3. OPTIONAL: Fetch the full User document using the ID from the token payload (excluding password field)
            // This is useful if controllers need more than just the ID and role.
            const currentUser = await User.findById(decoded.id).select('-password');

            if (!currentUser) {
                // User associated with the token no longer exists in the database
                return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
            }

            // 4. Attach the decoded payload (ID, role) AND the full User object to the request
            // We use req.user for the full document and req.auth for the decoded payload for flexibility.
            req.user = currentUser; 
            req.auth = decoded; 
            
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            // Handle token expiry, invalid signature, etc.
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    // 5. If no token is found in the header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};


/**
 * @desc Middleware to restrict access based on user role
 * @name restrictTo
 * @param {...string} allowedRoles - A list of roles that are allowed access (e.g., 'admin', 'manager')
 * @returns {function} The middleware function
 */
const restrictTo = (...allowedRoles) => {
    // This returns the actual middleware function for Express
    return (req, res, next) => {
        // We use req.user.role here, assuming the full User object was fetched in 'protect'
        // If you ONLY want to rely on the token payload, use req.auth.role
        const userRole = req.user?.role || req.auth?.role;

        if (!userRole) {
             return res.status(403).json({ message: 'Forbidden: Role information missing.' });
        }

        // Check if the user's role is included in the list of allowed roles
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: `Forbidden: User role '${userRole}' is not authorized to access this resource.` 
            });
        }
        
        next();
    };
};

module.exports = { protect, restrictTo };