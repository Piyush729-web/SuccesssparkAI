const express =require("express");
const {createSession, getSessionById, getMySession, deleteSession}= require("../controllers/session.controller");
const {protect} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create",protect,createSession);
router.get("/my-sessions",protect,getMySession);
router.get("/:id",protect,getSessionById);
router.delete("/:id",protect,deleteSession);

module.exports = router;