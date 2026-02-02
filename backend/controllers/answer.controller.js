const { GoogleGenAI } = require("@google/genai");
const Answer = require("../models/Answer.model.js");
const Question = require("../models/question.model.js");
const Session = require("../models/session.model.js");
const { answerEvaluationPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateAnswer = async (req, res) => {
    try {
        const { questionId, userAnswer } = req.body;
        const userId = req.user._id;

        if (!questionId || !userAnswer) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch the question
        const question = await Question.findById(questionId).populate('session');
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Get experience level from session
        const session = await Session.findById(question.session);
        const experience = session?.experience || "0-2";

        // Generate AI evaluation
        const prompt = answerEvaluationPrompt(
            question.question,
            userAnswer,
            experience
        );

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let rawText = response.text;

        const cleanedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();

        const evaluation = JSON.parse(cleanedText);

        // Save the answer and evaluation
        const answer = await Answer.create({
            question: questionId,
            user: userId,
            userAnswer,
            aiScore: evaluation.score,
            aiModelAnswer: evaluation.modelAnswer,
            aiFeedback: evaluation.feedback,
        });

        res.status(200).json({
            message: "Answer evaluated successfully",
            answer,
            evaluation
        });

    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).json({
            message: "Failed to evaluate answer",
            error: error.message,
        });
    }
};

const getUserAnswers = async (req, res) => {
    try {
        const userId = req.user._id;
        const { questionId } = req.params;

        let query = { user: userId };
        if (questionId) {
            query.question = questionId;
        }

        const answers = await Answer.find(query)
            .populate('question')
            .sort({ createdAt: -1 });

        res.status(200).json({
            answers,
            count: answers.length
        });

    } catch (error) {
        console.error("Error fetching answers:", error);
        res.status(500).json({
            message: "Failed to fetch answers",
            error: error.message,
        });
    }
};

const getAnswerStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all user answers with populated question and session data
        const answers = await Answer.find({ user: userId })
            .populate({
                path: 'question',
                populate: {
                    path: 'session',
                    select: 'topicToFocus role'
                }
            });

        // Calculate stats by topic
        const topicStats = {};

        answers.forEach(answer => {
            if (answer.question?.session?.topicToFocus) {
                const topic = answer.question.session.topicToFocus;

                if (!topicStats[topic]) {
                    topicStats[topic] = {
                        topic,
                        totalAnswers: 0,
                        averageScore: 0,
                        scores: []
                    };
                }

                topicStats[topic].totalAnswers++;
                topicStats[topic].scores.push(answer.aiScore);
            }
        });

        // Calculate averages
        Object.keys(topicStats).forEach(topic => {
            const scores = topicStats[topic].scores;
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            topicStats[topic].averageScore = Math.round(avg * 10) / 10;
            delete topicStats[topic].scores; // Remove raw scores from response
        });

        res.status(200).json({
            totalAnswers: answers.length,
            averageScore: answers.length > 0
                ? Math.round((answers.reduce((sum, a) => sum + a.aiScore, 0) / answers.length) * 10) / 10
                : 0,
            topicStats: Object.values(topicStats)
        });

    } catch (error) {
        console.error("Error fetching answer stats:", error);
        res.status(500).json({
            message: "Failed to fetch answer statistics",
            error: error.message,
        });
    }
};

module.exports = { evaluateAnswer, getUserAnswers, getAnswerStats };
