const express =require("express");
const {registerUser , loginUser , getUserProfile} = require("../controllers/auth.controller.js");
const { protect } =require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");
const uploadToCloudinary = require("../utils/cloudinary.js")

const router = express.Router();

//Auth Routes
router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.get("/profile" ,protect, getUserProfile);

// router.post("/upload-image", upload.single("image"), (req, res) => {
//     if (!req.file || !req.file.filename) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }
//     const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     res.status(200).json({ imageUrl });
// });

router.post("/upload-image", upload.single("image"), async (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const result = await uploadToCloudinary(req.file.buffer);
        const imageUrl = result.secure_url;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
});
module.exports =router;
