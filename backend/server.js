require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.route.js")
const sessionRoutes = require("./routes/session.route.js");
const questionRoutes = require("./routes/question.route.js");
const answerRoutes = require("./routes/answer.route.js");
const { protect } = require("./middlewares/auth.middleware.js");

const { generateInterviewQuestion, generateConceptExplanation } = require("./controllers/ai.controller.js");

const app = express();

connectDB();

app.use(express.json({ limit: "2mb" })); // Set body size limit
app.use(express.urlencoded({ extended: true }));

//middlewares to handle CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


//Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestion);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

//Serve uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads"),{}));

//Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});