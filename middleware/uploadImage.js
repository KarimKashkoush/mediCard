const multer = require('multer');

// Create multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the uploaded file
    }
});

// Create file type filter function
const fileFilter = function (req, file, cb) {
    // Check if the file type is acceptable
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        cb(new Error('Invalid file type'));
    }
};

// Create multer instance with the storage configuration and file type filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Middleware function to handle image file uploads
const uploadImage = upload.single('image'); // 'image' is the field name in the form-data

module.exports = { uploadImage };