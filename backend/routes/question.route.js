const express =require("express");

const {togglePinQuestion,updateQuestionNote,addQuestionToSession} = require("../controllers/question.controller")
const {protect} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add",protect,addQuestionToSession);
router.post("/:id/pin",protect,togglePinQuestion);
router.post("/:id/note",protect,updateQuestionNote);

module.exports =router;