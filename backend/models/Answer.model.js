const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    aiScore: {
        type: Number,
        min: 1,
        max: 10
    },
    aiModelAnswer: {
        type: String,
    },
    aiFeedback: {
        type: String,
    },
    evaluatedAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Answer", answerSchema);
