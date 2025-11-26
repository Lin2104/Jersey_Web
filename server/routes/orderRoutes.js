// // routes/orderRoutes.js (FULL CRUD IMPLEMENTATION)

// const express = require('express');
// const router = express.Router(); 
// const { protect, restrictTo } = require('../middleware/auth'); // ⬅️ IMPORTED
// // const SaleOrder = require('../models/Order'); // ⚠️ UPDATED IMPORT
// const upload = require('../middleware/upload'); 
// const SaleOrder = require('../models/SaleOrder');
// const Product = require('../models/Product'); // To fetch product data (price, name)
// const orderUpload = upload.single('paymentProof');
// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Essential to read EMAIL_USER/PASS
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Or 'smtp' and specify host/port for other services
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
//     // Optional for development if using Gmail:
//     // secure: true // use SSL
// });

// router.post('/', orderUpload, async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'Payment proof image is required.' });
//         }

//         const orderData = req.body; 
//         const productConfig = await Product.findOne({ slug: 'jersey' });
        
//         if (!productConfig) {
//             return res.status(500).json({ message: 'Product configuration not found on server.' });
//         }
        
//         // --- 1. CREATE AND SAVE ORDER ---
//         const newOrder = new SaleOrder({
//             // ... (order creation fields) ...
//             productId: productConfig._id, 
//             itemName: productConfig.name,
//             itemPrice: productConfig.price, 
//             customerName: orderData.customerName,
//             customerEmail: orderData.customerEmail,
//             studentId: orderData.studentId,
//             size: orderData.size,
//             quantity: orderData.quantity || 1, 
//             paymentMethod: orderData.paymentMethod,
//             paymentProofImageURL: req.file.path, 
//         });

//         const savedOrder = await newOrder.save();
        
//         // --- 2. 📧 SEND CUSTOMER CONFIRMATION EMAIL 📧 ---
//         const customerMailOptions = {
//             from: process.env.EMAIL_USER,
//             to: savedOrder.customerEmail, 
//            subject: `Order #${savedOrder._id.toString().substring(18).toUpperCase()} Confirmation: Payment Pending`,
//             html: `
//                 <h2>Order Confirmation for ${orderData.customerName}</h2>
//                 <p>Thank you for placing your order! We have successfully received your details and payment proof.</p>
//                 <p><strong>Order ID:</strong> ${savedOrder._id}</p>
//                 <p><strong>Item:</strong> ${savedOrder.itemName} (Size: ${savedOrder.size})</p>
//                 <p><strong>Total Amount:</strong> ${savedOrder.itemPrice * savedOrder.quantity} MMK</p>
//                 <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
//                 <p><strong>Current Status:</strong> ${savedOrder.status}</p>
//                 <hr>
//                 <p>Your order is now <strong>Pending Payment Verification</strong>. We will review the payment proof image you uploaded and update the status within 24 hours.</p>
//                 <p>If you have any questions, please reply to this email.</p>
//             `,
//         };

//         transporter.sendMail(customerMailOptions, (error, info) => {
//             if (error) {
//                 console.error("Customer Mail Error:", error);
//             } else {
//                 console.log('Customer confirmation email sent: ' + info.response);
//             }
//         });

//         // --- 3. 📧 SEND ADMIN NOTIFICATION EMAIL 📧 (NEW FUNCTION) ---
//         const adminMailOptions = {
//             from: process.env.EMAIL_USER,
//             // Use the dedicated admin email from the .env file
//             to: process.env.ADMIN_EMAIL, 
//             subject: `🚨 NEW ORDER RECEIVED: #${savedOrder._id.toString().substring(18).toUpperCase()} - ${savedOrder.customerName}`,
//             html: `
//                 <h2>New Order Alert - Action Required</h2>
//                 <p>A new order has been submitted and is awaiting payment verification.</p>
//                 <p><strong>Order ID:</strong> ${savedOrder._id}</p>
//                 <p><strong>Customer:</strong> ${savedOrder.customerName}</p>
//                 <p><strong>Email:</strong> ${savedOrder.customerEmail}</p>
//                 <p><strong>Student ID:</strong> ${savedOrder.studentId}</p>
//                 <p><strong>Item:</strong> ${savedOrder.itemName} (Size: ${savedOrder.size}, Qty: ${savedOrder.quantity})</p>
//                 <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
//                 <p>
//                     <a href="${savedOrder.paymentProofImageURL}" target="_blank">
//                         View Payment Proof Image
//                     </a>
//                 </p>
//                 <hr>
//                 <p>Please log into the admin panel to review and confirm payment.</p>
//             `,
//         };
        
//         transporter.sendMail(adminMailOptions, (error, info) => {
//             if (error) {
//                 console.error("Admin Mail Error:", error);
//             } else {
//                 console.log('Admin notification email sent: ' + info.response);
//             }
//         });
//         // ----------------------------------------------------

//         // 4. Respond to the client
//         res.status(201).json(savedOrder);

//     } catch (error) {
//         // ... (existing error handling) ...
//         console.error("Order POST Error:", error);
//         res.status(500).json({ 
//             message: 'Internal Server Error during order submission.',
//             error: error.message 
//         });
//     }
// });


// router.get('/', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         // 1. Get query parameters and set defaults
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10; // Default to 10 orders per page
//         const skip = (page - 1) * limit; // Calculate number of documents to skip

//         // 2. Count total documents (for pagination metadata)
//         const totalOrders = await SaleOrder.countDocuments();

//         // 3. Fetch orders using skip() and limit()
//         const orders = await SaleOrder.find()
//             .sort({ createdAt: -1 }) // Sort by newest first
//             .skip(skip)
//             .limit(limit);

//         // 4. Send back orders AND pagination metadata
//         res.status(200).json({
//             orders: orders,
//             page: page,
//             limit: limit,
//             totalPages: Math.ceil(totalOrders / limit),
//             totalResults: totalOrders
//         });

//     } catch (error) {
//         console.error("Order GET Error with Pagination:", error);
//         res.status(500).json({ message: 'Internal Server Error while fetching paginated orders.' });
//     }
// });

// // Route 3: Get a Specific Order by ID (GET /:id)
// // routes/orderRoutes.js

// // ... (existing code and imports) ...

// // Route 3: Get a Specific Order by ID (GET /:id)
// router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         const order = await SaleOrder.findById(req.params.id); // Use SaleOrder model

//         if (!order) {
//             // Case 1: ID is valid format, but no document exists with that ID
//             return res.status(404).json({ message: 'Order not found.' });
//         }
        
//         // Case 2: Success
//         res.status(200).json(order);
//     } catch (error) {
        
//         // --- NEW ERROR HANDLING ---
        
//         if (error.name === 'CastError') {
//             // Case 3: The ID format is invalid (e.g., shorter than 24 hex characters)
//             return res.status(400).json({ 
//                 message: 'Invalid Order ID format.',
//                 details: error.message 
//             });
//         }
        
//         // Case 4: Any other unhandled server error
//         res.status(500).json({ 
//             message: 'Internal Server Error while fetching order.',
//             error: error.message 
//         });
//     }
// });


// router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         const { status } = req.body;
//         const { id } = req.params; 

//         // 1. Basic Validation: Check if the status is provided
//         if (!status) {
//             return res.status(400).json({ message: 'New status is required in the request body.' });
//         }

//         // 2. Find and Update the Order
//         const updatedOrder = await SaleOrder.findByIdAndUpdate(
//             id,
//             { status: status }, // Only update the status field
//             { new: true, runValidators: true } // Return the new document and run schema validators
//         );

//         if (!updatedOrder) {
//             return res.status(404).json({ message: `Order with ID ${id} not found.` });
//         }

//         // 3. 📧 SEND STATUS UPDATE EMAIL 📧
//         // This logic runs for ANY successful status change (Confirmed, Delivered, etc.)
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: updatedOrder.customerEmail, // Use the customer's email from the updated document
//             subject: `Order #${updatedOrder._id.toString().substring(18).toUpperCase()} Status Update: ${status}`,
//             html: `
//                 <h2>Order Status Update</h2>
//                 <p>Hello ${updatedOrder.customerName},</p>
//                 <p>The status for your order </p>
//                 <p><strong>Order ID:</strong> ${updatedOrder._id} </p>
//                 <p>has been updated to:</p>
//                 <p style="font-size: 1.2em; font-weight: bold;">New Status: <span style="color: ${status === 'Confirmed' ? '#28a745' : '#007bff'};">${updatedOrder.status}</span></p>
//                 <hr>
//                 <p>Thank you for your patience!</p>
//             `,
//         };

//         // Send the email asynchronously
//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error("Status Update Email Error:", err);
//             } else {
//                 console.log('Status update email sent: ' + info.response);
//             }
//         });
//         // ------------------------------------

//         res.status(200).json(updatedOrder);

//     } catch (error) {
//         if (error.name === 'CastError' || error.name === 'ValidationError') {
//             return res.status(400).json({ message: `Invalid ID or Status provided.`, details: error.message });
//         }
//         console.error("Order PATCH Error:", error);
//         res.status(500).json({ message: 'Internal Server Error while updating order status.' });
//     }
// });

// router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         // 1. Find the order first to get customer details for the email
//         const orderToDelete = await SaleOrder.findById(req.params.id);

//         if (!orderToDelete) {
//              return res.status(404).json({ message: 'Order not found for deletion.' });
//         }
        
//         // 2. Perform the deletion (since we already fetched the necessary data)
//         const deletedOrder = await SaleOrder.findByIdAndDelete(req.params.id); 

//         // 3. 📧 SEND DELETION CONFIRMATION EMAIL 📧
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: orderToDelete.customerEmail, // Use the email from the document fetched in step 1
//             subject: `Order #${orderToDelete._id.toString().substring(18).toUpperCase()} Cancelled/Deleted`,
//             html: `
//                 <h2>Order Cancellation/Rejection Notice</h2>
//                 <p>Hello ${orderToDelete.customerName},</p>
//                 <p>This is to inform you that your </p>
//                 <p><strong>Order ID</strong>: ${orderToDelete._id}</p>
//                 <p>has been <span style={{ color: 'red' }}><strong>Cancelled/Rejected</strong></strong></span> by the administrator.</p>
//                 <p>Please contact support if you have any questions.</p>
//             `,
//         };

//         // Send the email asynchronously
//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error("Deletion Email Error:", err);
//             } else {
//                 console.log('Deletion email sent: ' + info.response);
//             }
//         });
//         // ------------------------------------
        
//         // 4. Respond to client with 204 No Content
//         res.status(204).send(); 
        
//     } catch (error) {
//         if (error.name === 'CastError') {
//             return res.status(400).json({ 
//                 message: 'Invalid Order ID format.',
//                 details: error.message 
//             });
//         }
//         console.error('Order DELETE Error:', error);
//         res.status(500).json({ message: 'Internal Server Error while deleting order.' });
//     }
// });

// module.exports = router;
// routes/orderRoutes.js (FULL CRUD IMPLEMENTATION)

// const express = require('express');
// const router = express.Router(); 
// const { protect, restrictTo } = require('../middleware/auth'); 
// const upload = require('../middleware/upload'); 
// const SaleOrder = require('../models/SaleOrder');
// const Product = require('../models/Product'); 
// const orderUpload = upload.single('paymentProof');
// const nodemailer = require('nodemailer');
// require('dotenv').config(); 
// const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,   // This will now be smtp.sendgrid.net
//     port: process.env.MAIL_PORT,   // This will be 587 (or 465)
//     secure: false,                 // Use false for port 587
//     requireTLS: true,
//     auth: {
//         user: process.env.EMAIL_USER, // This is always 'apikey' for SendGrid
//         pass: process.env.EMAIL_PASS, // This is your SendGrid API Key
//     },
// });

// // 🚨 NEW HELPER FUNCTION FOR STATUS COLORS 🚨
// const getStatusColorCode = (status) => {
//     switch (status) {
//         case 'Confirmed':
//             return '#28a745'; // Green
//         case 'Delivered':
//             return '#007bff'; // Blue
//         case 'Pending':
//             return '#ffc107'; // Yellow
//         case 'Cancelled/Rejected': // Use this for deletion/rejection notifications
//             return '#dc3545'; // Red
//         default:
//             return '#6c757d'; // Gray
//     }
// };
// // ------------------------------------------

// router.post('/', orderUpload, async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'Payment proof image is required.' });
//         }

//         const orderData = req.body; 
//         const productConfig = await Product.findOne({ slug: 'jersey' });
        
//         if (!productConfig) {
//             return res.status(500).json({ message: 'Product configuration not found on server.' });
//         }
        
//         // --- 1. CREATE AND SAVE ORDER ---
//         const newOrder = new SaleOrder({
//             productId: productConfig._id, 
//             itemName: productConfig.name,
//             itemPrice: productConfig.price, 
//             customerName: orderData.customerName,
//             customerEmail: orderData.customerEmail,
//             studentId: orderData.studentId,
//             size: orderData.size,
//             quantity: orderData.quantity || 1, 
//             paymentMethod: orderData.paymentMethod,
//             paymentProofImageURL: req.file.path, 
//         });

//         const savedOrder = await newOrder.save();
        
//         // --- 2. 📧 SEND CUSTOMER CONFIRMATION EMAIL 📧 ---
//         const customerMailOptions = {
//             from: process.env.EMAIL_USER,
//             to: savedOrder.customerEmail, 
//             subject: `Order #${savedOrder._id.toString().substring(18).toUpperCase()} Confirmation: Payment Pending`,
//             html: `
//                 <h2>Order Confirmation for ${orderData.customerName}</h2>
//                 <p>Thank you for placing your order! We have successfully received your details and payment proof.</p>
//                 <p><strong>Order ID:</strong> ${savedOrder._id}</p>
//                 <p><strong>Item:</strong> ${savedOrder.itemName} (Size: ${savedOrder.size})</p>
//                 <p><strong>Total Amount:</strong> ${savedOrder.itemPrice * savedOrder.quantity} MMK</p>
//                 <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
//                 <p><strong>Current Status:</strong> <span style="color: ${getStatusColorCode(savedOrder.status)}; font-weight: bold;">${savedOrder.status}</span></p>
//                 <hr>
//                 <p>Your order is now <strong>Pending Payment Verification</strong>. We will review the payment proof image you uploaded and update the status within 24 hours.</p>
//                 <p>If you have any questions, please reply to this email.</p>
//             `,
//         };

//         transporter.sendMail(customerMailOptions, (error, info) => {
//             if (error) {
//                 console.error("Customer Mail Error:", error);
//             } else {
//                 console.log('Customer confirmation email sent: ' + info.response);
//             }
//         });

//         // --- 3. 📧 SEND ADMIN NOTIFICATION EMAIL 📧 (UNCHANGED) ---
//         const adminMailOptions = {
//             from: process.env.EMAIL_USER,
//             to: process.env.ADMIN_EMAIL, 
//             subject: `🚨 NEW ORDER RECEIVED: #${savedOrder._id.toString().substring(18).toUpperCase()} - ${savedOrder.customerName}`,
//             html: `
//                 <h2>New Order Alert - Action Required</h2>
//                 <p>A new order has been submitted and is awaiting payment verification.</p>
//                 <p><strong>Order ID:</strong> ${savedOrder._id}</p>
//                 <p><strong>Customer:</strong> ${savedOrder.customerName}</p>
//                 <p><strong>Email:</strong> ${savedOrder.customerEmail}</p>
//                 <p><strong>Student ID:</strong> ${savedOrder.studentId}</p>
//                 <p><strong>Item:</strong> ${savedOrder.itemName} (Size: ${savedOrder.size}, Qty: ${savedOrder.quantity})</p>
//                 <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
//                 <p><a href="${savedOrder.paymentProofImageURL}" target="_blank">View Payment Proof Image</a></p>
//                 <hr>
//                 <p>Please log into the admin panel to review and confirm payment.</p>
//             `,
//         };
        
//         transporter.sendMail(adminMailOptions, (error, info) => {
//             if (error) {
//                 console.error("Admin Mail Error:", error);
//             } else {
//                 console.log('Admin notification email sent: ' + info.response);
//             }
//         });

//         // 4. Respond to the client
//         res.status(201).json(savedOrder);

//     } catch (error) {
//         console.error("Order POST Error:", error);
//         res.status(500).json({ 
//             message: 'Internal Server Error during order submission.',
//             error: error.message 
//         });
//     }
// });


// router.get('/', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10; 
//         const skip = (page - 1) * limit; 

//         const totalOrders = await SaleOrder.countDocuments();

//         const orders = await SaleOrder.find()
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         res.status(200).json({
//             orders: orders,
//             page: page,
//             limit: limit,
//             totalPages: Math.ceil(totalOrders / limit),
//             totalResults: totalOrders
//         });

//     } catch (error) {
//         console.error("Order GET Error with Pagination:", error);
//         res.status(500).json({ message: 'Internal Server Error while fetching paginated orders.' });
//     }
// });

// // Route 3: Get a Specific Order by ID (GET /:id)
// router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         const order = await SaleOrder.findById(req.params.id); 

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found.' });
//         }
        
//         res.status(200).json(order);
//     } catch (error) {
        
//         if (error.name === 'CastError') {
//             return res.status(400).json({ 
//                 message: 'Invalid Order ID format.',
//                 details: error.message 
//             });
//         }
        
//         res.status(500).json({ 
//             message: 'Internal Server Error while fetching order.',
//             error: error.message 
//         });
//     }
// });


// router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         const { status } = req.body;
//         const { id } = req.params; 

//         if (!status) {
//             return res.status(400).json({ message: 'New status is required in the request body.' });
//         }

//         const updatedOrder = await SaleOrder.findByIdAndUpdate(
//             id,
//             { status: status },
//             { new: true, runValidators: true } 
//         );

//         if (!updatedOrder) {
//             return res.status(404).json({ message: `Order with ID ${id} not found.` });
//         }

//         // 3. 📧 SEND STATUS UPDATE EMAIL 📧
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: updatedOrder.customerEmail,
//             subject: `Order #${updatedOrder._id.toString().substring(18).toUpperCase()} Status Update: ${status}`,
//             html: `
//                 <h2>Order Status Update</h2>
//                 <p>Hello ${updatedOrder.customerName},</p>
//                 <p>The status for your order </p>
//                 <p><strong>Order ID:</strong> ${updatedOrder._id} </p>
//                 <p>has been updated to:</p>
                
                
//                 <p style="font-size: 1.2em; font-weight: bold;">New Status: <span style="color: ${getStatusColorCode(updatedOrder.status)};">${updatedOrder.status}</span></p>
//                 <hr>
//                 <p>Thank you for your patience!</p>
//             `,
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error("Status Update Email Error:", err);
//             } else {
//                 console.log('Status update email sent: ' + info.response);
//             }
//         });

//         res.status(200).json(updatedOrder);

//     } catch (error) {
//         if (error.name === 'CastError' || error.name === 'ValidationError') {
//             return res.status(400).json({ message: `Invalid ID or Status provided.`, details: error.message });
//         }
//         console.error("Order PATCH Error:", error);
//         res.status(500).json({ message: 'Internal Server Error while updating order status.' });
//     }
// });

// router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
//     try {
//         const orderToDelete = await SaleOrder.findById(req.params.id);

//         if (!orderToDelete) {
//              return res.status(404).json({ message: 'Order not found for deletion.' });
//         }
        
//         await SaleOrder.findByIdAndDelete(req.params.id); 

//         // 3. 📧 SEND DELETION CONFIRMATION EMAIL 📧
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: orderToDelete.customerEmail,
//             subject: `Order #${orderToDelete._id.toString().substring(18).toUpperCase()} Cancelled/Deleted`,
//             html: `
//                 <h2>Order Cancellation/Rejection Notice</h2>
//                 <p>Hello ${orderToDelete.customerName},</p>
//                 <p>This is to inform you that your </p>
//                 <p><strong>Order ID</strong>: ${orderToDelete._id}</p>
//                 <p>has been <span style="font-weight: bold; color: ${getStatusColorCode('Cancelled/Rejected')};">Cancelled/Rejected</span> by the administrator.</p>
//                 <p>Please contact support if you have any questions.</p>
//             `,
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error("Deletion Email Error:", err);
//             } else {
//                 console.log('Deletion email sent: ' + info.response);
//             }
//         });
        
//         res.status(204).send(); 
        
//     } catch (error) {
//         if (error.name === 'CastError') {
//             return res.status(400).json({ 
//                 message: 'Invalid Order ID format.',
//                 details: error.message 
//             });
//         }
//         console.error('Order DELETE Error:', error);
//         res.status(500).json({ message: 'Internal Server Error while deleting order.' });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router(); 
const { protect, restrictTo } = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 
const SaleOrder = require('../models/SaleOrder');
const Product = require('../models/Product'); 
const orderUpload = upload.single('paymentProof');

// 🚨 CRITICAL FIX: SWAP FROM NODEMAILER (SMTP) TO SENDGRID (HTTP API) 🚨
// const nodemailer = require('nodemailer'); // REMOVED
// require('dotenv').config(); // Assuming this is done in a central file like server.js
const sgMail = require('@sendgrid/mail');

// 1. SET API KEY using the new standard variable name
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 2. DEFINE VERIFIED SENDER ADDRESS (MUST BE VERIFIED ON SENDGRID)
// We assume you have set this address as an ENV variable named SENDER_EMAIL_ADDRESS
const VERIFIED_SENDER_ADDRESS = process.env.SENDER_EMAIL_ADDRESS || 'placeholder@example.com'; 
// NOTE: Ensure you set VERIFIED_SENDER_ADDRESS on Render!

// ---------------------------------------------------------------------------------------

// 🚨 HELPER FUNCTION FOR STATUS COLORS 🚨
const getStatusColorCode = (status) => {
    switch (status) {
        case 'Confirmed':
            return '#28a745'; // Green
        case 'Delivered':
            return '#007bff'; // Blue
        case 'Pending':
            return '#ffc107'; // Yellow
        case 'Cancelled/Rejected':
            return '#dc3545'; // Red
        default:
            return '#6c757d'; // Gray
    }
};
// ------------------------------------------

router.post('/', orderUpload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Payment proof image is required.' });
        }

        const orderData = req.body; 
        const productConfig = await Product.findOne({ slug: 'jersey' });
        
        if (!productConfig) {
            return res.status(500).json({ message: 'Product configuration not found on server.' });
        }
        
        // --- 1. CREATE AND SAVE ORDER ---
        const newOrder = new SaleOrder({
            productId: productConfig._id, 
            itemName: productConfig.name,
            itemPrice: productConfig.price, 
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            studentId: orderData.studentId,
            size: orderData.size,
            quantity: orderData.quantity || 1, 
            paymentMethod: orderData.paymentMethod,
            paymentProofImageURL: req.file.path, 
        });

        const savedOrder = await newOrder.save();
        const orderIdShort = savedOrder._id.toString().substring(18).toUpperCase();
        
        // --- 2. 📧 SEND CUSTOMER CONFIRMATION EMAIL 📧 ---
        const customerMailOptions = {
            from: VERIFIED_SENDER_ADDRESS, // Use verified address
            to: savedOrder.customerEmail, 
            subject: `Order #${orderIdShort} Confirmation: Payment Pending`,
            html: `
                <h2>Order Confirmation for ${orderData.customerName}</h2>
                <p>Thank you for placing your order! We have successfully received your details and payment proof.</p>
                <p><strong>Order ID:</strong> ${savedOrder._id}</p>
                <p><strong>Item:</strong> ${savedOrder.itemName} (Size: ${savedOrder.size})</p>
                <p><strong>Total Amount:</strong> ${savedOrder.itemPrice * savedOrder.quantity} MMK</p>
                <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
                <p><strong>Current Status:</strong> <span style="color: ${getStatusColorCode(savedOrder.status)}; font-weight: bold;">${savedOrder.status}</span></p>
                <hr>
                <p>Your order is now <strong>Pending Payment Verification</strong>. We will review the payment proof image you uploaded and update the status within 24 hours.</p>
                <p>If you have any questions, please reply to this email.</p>
            `,
        };

        // --- 3. 📧 SEND ADMIN NOTIFICATION EMAIL 📧 ---
        // At the beginning of your function, capture the current date and format it
const now = new Date();
// Format the date/time string (e.g., "November 26, 2025 at 8:30 AM")
const formattedDateTime = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short' // Includes the timezone (e.g., PST, +0630)
});

const adminMailOptions = {
    from: VERIFIED_SENDER_ADDRESS, // Use verified address
    to: process.env.ADMIN_EMAIL, 
    subject: `🚨 NEW ORDER RECEIVED: #${orderIdShort} - ${savedOrder.customerName}`,
    html: `
        <h2>New Order Alert - Action Required</h2>
        <p>A new order has been submitted and is awaiting payment verification.</p>
        
        <hr>
        <p>⏱️ **Received At:** ${formattedDateTime}</p> ⬅️ ADDED DATE/TIME HERE
        <hr>
        
        <p><strong>Order ID:</strong> ${savedOrder._id}</p>
        <p><strong>Customer:</strong> ${savedOrder.customerName}</p>
        <p><strong>Email:</strong> ${savedOrder.customerEmail}</p>
        <p><strong>Student ID:</strong> ${savedOrder.studentId}</p>
        <p><strong>Item:</strong> ${savedOrder.itemName} (Size: ${savedOrder.size}, Qty: ${savedOrder.quantity})</p>
        <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
        <p><a href="${savedOrder.paymentProofImageURL}" target="_blank">View Payment Proof Image</a></p>
        <hr>
        <p>Please log into the admin panel to review and confirm payment.</p>
    `,
};
        
        // 🚨 NEW ASYNC/AWAIT SENDING LOGIC 🚨
        try {
            await sgMail.send(customerMailOptions);
            console.log('Customer confirmation email sent successfully via SendGrid API.');
            await sgMail.send(adminMailOptions);
            console.log('Admin notification email sent successfully via SendGrid API.');
        } catch (error) {
            console.error("API Email Sending Error:", error.response ? error.response.body : error);
            // DO NOT block the order from saving just because the email failed.
        }

        // 4. Respond to the client
        res.status(201).json(savedOrder);

    } catch (error) {
        console.error("Order POST Error:", error);
        res.status(500).json({ 
            message: 'Internal Server Error during order submission.',
            error: error.message 
        });
    }
});


// ---------------------------------------------------------------------------------------
// --- REST OF ROUTES REFITTED WITH SENDGRID API ---
// ---------------------------------------------------------------------------------------


router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit; 

        const totalOrders = await SaleOrder.countDocuments();

        const orders = await SaleOrder.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            orders: orders,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalOrders / limit),
            totalResults: totalOrders
        });

    } catch (error) {
        console.error("Order GET Error with Pagination:", error);
        res.status(500).json({ message: 'Internal Server Error while fetching paginated orders.' });
    }
});

// Route 3: Get a Specific Order by ID (GET /:id)
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const order = await SaleOrder.findById(req.params.id); 

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid Order ID format.',
                details: error.message 
            });
        }
        
        res.status(500).json({ 
            message: 'Internal Server Error while fetching order.',
            error: error.message 
        });
    }
});


router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params; 

        if (!status) {
            return res.status(400).json({ message: 'New status is required in the request body.' });
        }

        const updatedOrder = await SaleOrder.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: `Order with ID ${id} not found.` });
        }

        // 3. 📧 SEND STATUS UPDATE EMAIL 📧
        const mailOptions = {
            from: VERIFIED_SENDER_ADDRESS,
            to: updatedOrder.customerEmail,
            subject: `Order #${updatedOrder._id.toString().substring(18).toUpperCase()} Status Update: ${status}`,
            html: `
                <h2>Order Status Update</h2>
                <p>Hello ${updatedOrder.customerName},</p>
                <p>The status for your order </p>
                <p><strong>Order ID:</strong> ${updatedOrder._id} </p>
                <p>has been updated to:</p>
                
                
                <p style="font-size: 1.2em; font-weight: bold;">New Status: <span style="color: ${getStatusColorCode(updatedOrder.status)};">${updatedOrder.status}</span></p>
                <hr>
                <p>Thank you for your patience!</p>
            `,
        };

        try {
            await sgMail.send(mailOptions);
            console.log('Status update email sent successfully via SendGrid API.');
        } catch (error) {
            console.error("Status Update Email Error:", error.response ? error.response.body : error);
        }

        res.status(200).json(updatedOrder);

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError') {
            return res.status(400).json({ message: `Invalid ID or Status provided.`, details: error.message });
        }
        console.error("Order PATCH Error:", error);
        res.status(500).json({ message: 'Internal Server Error while updating order status.' });
    }
});

router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const orderToDelete = await SaleOrder.findById(req.params.id);

        if (!orderToDelete) {
             return res.status(404).json({ message: 'Order not found for deletion.' });
        }
        
        await SaleOrder.findByIdAndDelete(req.params.id); 

        // 3. 📧 SEND DELETION CONFIRMATION EMAIL 📧
        const mailOptions = {
            from: VERIFIED_SENDER_ADDRESS,
            to: orderToDelete.customerEmail,
            subject: `Order #${orderToDelete._id.toString().substring(18).toUpperCase()} Cancelled/Deleted`,
            html: `
                <h2>Order Cancellation/Rejection Notice</h2>
                <p>Hello ${orderToDelete.customerName},</p>
                <p>This is to inform you that your </p>
                <p><strong>Order ID</strong>: ${orderToDelete._id}</p>
                <p>has been <span style="font-weight: bold; color: ${getStatusColorCode('Cancelled/Rejected')};">Cancelled/Rejected</span> by the administrator.</p>
                <p>Please contact support if you have any questions.</p>
            `,
        };

        try {
            await sgMail.send(mailOptions);
            console.log('Deletion email sent successfully via SendGrid API.');
        } catch (error) {
            console.error("Deletion Email Error:", error.response ? error.response.body : error);
        }
        
        res.status(204).send(); 
        
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid Order ID format.',
                details: error.message 
            });
        }
        console.error('Order DELETE Error:', error);
        res.status(500).json({ message: 'Internal Server Error while deleting order.' });
    }
});

module.exports = router;
