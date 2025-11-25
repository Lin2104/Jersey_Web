// middleware/upload.js

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
// 1. Get the entire module object
const cloudinaryStorageModule = require('multer-storage-cloudinary');
// 2. Access the constructor from the module object's property.
//    This is the robust syntax that solves the TypeError.
const CloudinaryStorage = cloudinaryStorageModule.CloudinaryStorage; // ⬅️ THIS IS THE CRITICAL LINE

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({ 
    cloudinary: cloudinary, // Ensure your config/cloudinary exports v2
    params: {
        folder: 'preorder-app-proofs', 
        allowed_formats: ['jpeg', 'jpg', 'png'],
    },
});

// Configure Multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true); 
        } else {
            cb(new Error('Only JPEG, JPG, and PNG file types are allowed.'), false); 
        }
    }
});

module.exports = upload;