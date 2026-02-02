// const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (_req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const fileFilter = (_req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false);
//     }
// };
// const upload = multer({ storage, fileFilter });
// module.exports = upload;


const multer = require("multer");

const storage = multer.memoryStorage(); // use in-memory buffer

const fileFilter = (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;