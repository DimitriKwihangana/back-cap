const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'uploads',
            format: file.mimetype === 'application/pdf' ? undefined : 'png', // Only images are converted to PNG
            public_id: `${Date.now()}-${file.originalname}`
        };
    }
});

// File filter to allow images and PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
