const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'parampara-foods',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;