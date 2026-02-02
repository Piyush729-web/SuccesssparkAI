const express = require("express");
const { evaluateAnswer, getUserAnswers, getAnswerStats } = require("../controllers/answer.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Evaluate user's answer
router.post("/evaluate", evaluateAnswer);

// Get user's answer history
router.get("/user", getUserAnswers);

// Get user's answer history for specific question
router.get("/user/question/:questionId", getUserAnswers);

// Get answer statistics for dashboard
router.get("/stats", getAnswerStats);

module.exports = router;
