// // models/SaleOrder.js

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const SaleOrderSchema = new Schema({
//     // --- Single Item Details (for the reference) ---
//     // You could pre-populate these from a single item configuration in your app
//     itemName: {
//         type: String,
//         required: true,
//         default: "Your Product Name" // Change this to your actual item name
//     },
//     itemPrice: {
//         type: Number,
//         required: true,
//         min: 0.01,
//         default: 100 // Change this to your actual price
//     },
//     // The quantity the student ordered (must be >= 1)
//     quantity: {
//         type: Number,
//         required: true,
//         min: 1
//     },
//     size: {
//         type: String,
//         required: true,
//         // Enforce specific allowed sizes for consistency
//         enum: ['XS', 'S', 'M', 'L', 'XL', 'OVER'], 
//         trim: true
//     },

//     // --- Customer Details (Student) ---
//     customerName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     customerEmail: {
//         type: String,
//         required: true,
//         lowercase: true,
//         trim: true,
//         match: [/.+@.+\..+/, 'Please fill a valid email address']
//     },
//     studentId: { // New required field
//         type: String,
//         required: true,
//         unique: true, // Assuming one student ID per order/account
//         trim: true
//     },

//     // --- Payment Details ---
//     paymentMethod: { // Selected method (e.g., KBZ Pay, Wave Money)
//         type: String,
//         required: true,
//         enum: ['KBZ Pay', 'Wave Money'], // Define your allowed options
//     },
//     // The image uploaded by the customer to prove payment
//     paymentProofImageURL: { 
//         type: String,
//         required: true,
//         // In a real application, you would store the actual image URL here after uploading it to a service like AWS S3 or Cloudinary.
//     },
    
//     // --- Order Status ---
//     status: {
//         type: String,
//         enum: ['Pending Payment Verification', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
//         default: 'Pending Payment Verification'
//     }
// }, {
//     timestamps: true
// });

// const SaleOrder = mongoose.model('SaleOrder', SaleOrderSchema);

// module.exports = SaleOrder;
// models/SaleOrder.js (SIMPLIFIED)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleOrderSchema = new Schema({
    // --- 1. Product Reference (Best Practice) ---
    // This links the order to the specific product configuration
    productId: {
        type: Schema.Types.ObjectId,
        required: true 
    },

    // --- 2. Item Details (Snapshot at time of order) ---
    // These fields are necessary for record-keeping and calculating the total.
    itemName: {
        type: String,
        required: true,
    },
    itemPrice: { // The final price charged for the single item
        type: Number,
        required: true,
        // Removed min: 0.01
    },
    quantity: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
        // Removed enum
        trim: true
    },

    // --- 3. Customer Details (Student) ---
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    studentId: { 
        type: String,
        required: true,
        trim: true
    },

    // --- 4. Payment Details ---
    paymentMethod: { // Selected method (e.g., KBZ Pay, Wave Money)
        type: String,
        required: true,
        // Removed enum
    },
    paymentProofImageURL: { 
        type: String,
        required: true,
    },
    
    // --- 5. Order Status (For Admin Management) ---
    status: {
        type: String,
        // Kept enum here, as status states are internal process definitions
        enum: ['Pending Payment Verification', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'],
        default: 'Pending Payment Verification'
    }
}, {
    timestamps: true
});

const SaleOrder = mongoose.model('SaleOrder', SaleOrderSchema);

module.exports = SaleOrder;