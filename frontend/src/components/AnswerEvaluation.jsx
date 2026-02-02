import { motion } from "framer-motion";
import { LuCircleCheck, LuInfo, LuTrendingUp } from "react-icons/lu";
import ReactMarkdown from "react-markdown";

const AnswerEvaluation = ({ evaluation }) => {
    if (!evaluation) return null;

    const { score, modelAnswer, feedback } = evaluation;

    // Determine score color and icon
    const getScoreColor = (score) => {
        if (score >= 8) return "text-green-600 dark:text-green-400";
        if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreIcon = (score) => {
        if (score >= 8) return <LuCircleCheck className="text-2xl" />;
        if (score >= 6) return <LuTrendingUp className="text-2xl" />;
        return <LuInfo className="text-2xl" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-4"
        >
            {/* Score Display */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            AI Evaluation Score
                        </p>
                        <div className={`flex items-center gap-2 mt-2 ${getScoreColor(score)}`}>
                            {getScoreIcon(score)}
                            <span className="text-4xl font-bold">{score}/10</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                {score >= 8 ? "🎉" : score >= 6 ? "👍" : "💪"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <LuInfo className="text-blue-600 dark:text-blue-400" />
                    Feedback
                </h3>
                <div className="prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
            </div>

            {/* Model Answer */}
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <LuCircleCheck className="text-green-600 dark:text-green-400" />
                    Model Answer
                </h3>
                <div className="prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{modelAnswer}</ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
};

export default AnswerEvaluation;
