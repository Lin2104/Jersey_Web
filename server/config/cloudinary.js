// config/cloudinary.js

const cloudinary = require('cloudinary').v2; // Make sure this is .v2
// Make sure you're calling .config() here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary; // <--- Must export the initialized object