// routes/productRoutes.js (UPDATED)

const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product model
const upload = require('../middleware/upload'); // ⬅️ THIS LINE MUST BE PRESENT
const productUploads = upload.fields([
    // 1. Array of images (up to 5)
    { name: 'productImages', maxCount: 5 }, 
    // 2. Single video file
    { name: 'productVideo', maxCount: 1 }, 
    // 3. KBZ Pay QR Code (remains the same)
    { name: 'KBZPayQR', maxCount: 1 }, 
    // 4. Wave Money QR Code (remains the same)
    { name: 'WaveMoneyQR', maxCount: 1 } 
    // Add other payment methods here as needed
]);

// Route 1: GET the single product data (Existing route)
router.get('/', async (req, res) => {
    try {
        // const product = await Product.findOne({ slug: 'jersey' });
        const product = await Product.findOne();
        if (!product) {
            // If the product doesn't exist, we return a 404, which is okay 
            // because we are about to create it with the POST route.
            return res.status(404).json({ message: 'Product data not found. Use POST to create one.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching product data.',
            error: error.message 
        });
    }
});

// -----------------------------------------------------------------
// Route 2: POST to create a new Product (NEW ROUTE)
// -----------------------------------------------------------------
router.post('/', productUploads, async (req, res) => {
    try {
        // --- PRE-VALIDATION ---
        const existingProduct = await Product.findOne({ slug: 'jersey' });
        if (existingProduct) {
            return res.status(409).json({ message: 'A product with slug "jersey" already exists. Use PATCH to update it.' });
        }

        const productData = { ...req.body };
        const mediaArray = [];
        const qrCodesMap = {};

        // --- 1. HANDLE MAIN MEDIA (Images and Video) ---
        
        // a. Product Images (Multiple)
        if (req.files.productImages && req.files.productImages.length > 0) {
            req.files.productImages.forEach(file => {
                mediaArray.push({ url: file.path, type: 'image' });
            });
        }
        
        // b. Product Video (Single)
        if (req.files.productVideo && req.files.productVideo.length > 0) {
            mediaArray.push({ url: req.files.productVideo[0].path, type: 'video' });
        }
        
        // Check if at least one main media file was uploaded (required for product creation)
        if (mediaArray.length === 0) {
            return res.status(400).json({ message: 'At least one product image or video is required.' });
        }
        
        // --- 2. HANDLE QR CODE UPLOADS ---
        
        if (req.files.KBZPayQR && req.files.KBZPayQR.length > 0) {
    qrCodesMap['KBZ Pay'] = req.files.KBZPayQR[0].path;
}

if (req.files.WaveMoneyQR && req.files.WaveMoneyQR.length > 0) {
    qrCodesMap['Wave Money'] = req.files.WaveMoneyQR[0].path;
}

// ⬅️ CRITICAL CHECK: ENSURE QR CODES ARE PROVIDED IF REQUIRED BY SCHEMA
if (Object.keys(qrCodesMap).length === 0) {
    // If you REQUIRE at least one QR code for creation:
    return res.status(400).json({ message: 'At least one payment QR code (KBZ Pay or Wave Money) is required.' });
}
        // Note: You can add logic here to enforce that at least one QR code is provided,
        // if required by your application.

        // --- 3. HANDLE TEXT DATA PARSING ---
        
        // Manually parse JSON string for 'availableSizes'
        if (productData.availableSizes && typeof productData.availableSizes === 'string') {
            try {
                productData.availableSizes = JSON.parse(productData.availableSizes);
            } catch (e) {
                return res.status(400).json({ message: 'Invalid format for availableSizes. Must be a valid JSON array string.' });
            }
        }
        
        // --- 4. SAVE TO DB ---
        const newProduct = new Product({
            ...productData,
            media: mediaArray,          // All images and videos
            qrCodes: qrCodesMap,        // All uploaded QR codes
            slug: 'jersey'
        });

        const savedProduct = await newProduct.save();
        
        res.status(201).json(savedProduct);

    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation failed. Check required fields and data types.',
                details: error.message 
            });
        }
        console.error("Product POST Error:", error);
        res.status(500).json({ 
            message: 'Internal Server Error while creating product.',
            error: error.message 
        });
    }
});
// routes/productRoutes.js (INSIDE router.patch)

router.patch('/', productUploads, async (req, res) => {
    try {
        // ... (pre-validation, existing product check) ...
        
        const product = await Product.findOne({ slug: 'jersey' });
        const productData = { ...req.body };
        const updateFields = {};
        
        // --- CONSTRUCT THE NEW MEDIA ARRAY ---
        const newMedia = [];

        // a. Handle Product Images (Multiple)
        if (req.files.productImages && req.files.productImages.length > 0) {
            req.files.productImages.forEach(file => {
                newMedia.push({ url: file.path, type: 'image' });
            });
        }
        
        // b. Handle Product Video (Single)
        if (req.files.productVideo && req.files.productVideo.length > 0) {
            // Note: Cloudinary handles video uploads fine through the same Multer setup
            newMedia.push({ url: req.files.productVideo[0].path, type: 'video' });
        }
        
        // c. If any new media was uploaded, update the media field
        if (newMedia.length > 0) {
            // OPTION: We assume the patch REPLACES all media for simplicity. 
            // If you want to ADD to existing media, you'd merge newMedia with product.media.
            updateFields.media = newMedia;
        }

        // --- (rest of the file handling remains the same) ---
        // (QR Code handling remains the same, using req.files.KBZPayQR, etc.)
        
        const currentQrCodes = product.qrCodes || {}; 
            
        if (req.files.KBZPayQR && req.files.KBZPayQR.length > 0) {
            currentQrCodes['KBZ Pay'] = req.files.KBZPayQR[0].path;
        }
        if (req.files.WaveMoneyQR && req.files.WaveMoneyQR.length > 0) {
            currentQrCodes['Wave Money'] = req.files.WaveMoneyQR[0].path;
        }
        
        // If any QR image was uploaded, update the qrCodes field
        if (Object.keys(req.files).some(key => key.includes('QR'))) {
            updateFields.qrCodes = currentQrCodes;
        }
        
        // --- (Text data parsing for availableSizes remains the same) ---
        if (productData.availableSizes && typeof productData.availableSizes === 'string') {
            updateFields.availableSizes = JSON.parse(productData.availableSizes); // Add to updateFields
        }

        // --- APPLY UPDATES ---
        const finalUpdate = { 
            ...productData,
            ...updateFields, // Merges all file-based and array updates
        };

        // ... (rest of the database update logic) ...
        
        const updatedProduct = await Product.findOneAndUpdate(
            { slug: 'jersey' },
            { $set: finalUpdate }, 
            { new: true, runValidators: true } 
        );
        
        res.status(200).json(updatedProduct);

    } catch (error) {
        // ... (error handling) ...
    }
});
module.exports = router;