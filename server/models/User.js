const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ⬅️ NEW: Required for hashing
const Schema = mongoose.Schema;

/**
 * Mongoose Schema for the User (Admin) model.
 * Stores username, a hashed password, and the user's role.
 */
const UserSchema = new Schema({
    username: { 
        type: String, 
        required: [true, 'Username is required'], 
        unique: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters.'],
        select: false // ⬅️ CRITICAL FOR SECURITY: Prevents password from being returned in query results by default
    },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    },
}, { 
    timestamps: true 
});

// -----------------------------------------------------------------
// Mongoose Pre-Save Hook (Document Middleware) 🛡️
// -----------------------------------------------------------------

// Runs BEFORE a document is saved (e.g., on User.create() or user.save())
UserSchema.pre('save', function (next) { 
    // This hook is defined as synchronous, but returns an async operation (a Promise).
    
    // 1. Check if password field was modified.
    if (!this.isModified('password')) {
        return next();
    }

    // 2. Hash Password and return the promise chain.
    // Mongoose waits for this promise to resolve before saving the document.
    return bcrypt.genSalt(10) // ⬅️ Promise chain starts here
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash;
            // IMPORTANT: If you return a promise, you should call next() only on the success path.
            // If the promise rejects, Mongoose handles the error automatically.
        })
        .catch(err => {
            // 🛑 FIX: Throw an error or call next(err). Since we're in a .catch, throwing is cleaner.
            // The throw statement rejects the promise, which Mongoose catches.
            throw err; 
        });
});


// -----------------------------------------------------------------
// Mongoose Instance Method (for Login Comparison) 🔑
// -----------------------------------------------------------------

/**
 * @desc Method to compare the provided password with the hashed password in the DB.
 * NOTE: The login route (authRoutes.js) must use .select('+password') to retrieve the hashed value.
 * @param {string} candidatePassword - The plain text password entered by the user
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
UserSchema.methods.matchPassword = async function (candidatePassword) {
    // 'this.password' here contains the hashed password because the login route
    // explicitly fetches it via .select('+password')
    return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);