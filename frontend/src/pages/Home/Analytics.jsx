import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { LuTrendingUp, LuTarget, LuAward } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnswerStats();
    }, []);

    const fetchAnswerStats = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(API_PATHS.ANSWER.GET_STATS);
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Transform data for radar chart
    const radarData = stats?.topicStats?.map((topic) => ({
        subject: topic.topic.length > 20 ? topic.topic.substring(0, 17) + "..." : topic.topic,
        score: topic.averageScore,
        fullMark: 10,
    })) || [];

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Your Progress Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Track your interview preparation performance across different topics
                    </p>
                </motion.div>

                {isLoading ? (
                    <SkeletonLoader count={3} />
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Answers
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                            {stats?.totalAnswers || 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                                        <LuTrendingUp className="text-white text-2xl" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Average Score
                                        </p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                                            {stats?.averageScore || 0}/10
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center">
                                        <LuAward className="text-white text-2xl" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Topics Covered
                                        </p>
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                                            {stats?.topicStats?.length || 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                                        <LuTarget className="text-white text-2xl" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Radar Chart */}
                        {radarData.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 mb-8"
                            >
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Performance by Topic
                                </h2>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={{ fill: "#6b7280", fontSize: 12 }}
                                        />
                                        <PolarRadiusAxis angle={90} domain={[0, 10]} />
                                        <Radar
                                            name="Score"
                                            dataKey="score"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.6}
                                        />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        )}

                        {/* Topic Breakdown */}
                        {stats?.topicStats && stats.topicStats.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800"
                            >
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Detailed Breakdown
                                </h2>
                                <div className="space-y-4">
                                    {stats.topicStats.map((topic, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {topic.topic}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {topic.totalAnswers} answer{topic.totalAnswers !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${(topic.averageScore / 10) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white w-16 text-right">
                                                    {topic.averageScore}/10
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Empty State */}
                        {(!stats || stats.totalAnswers === 0) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Data Yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Start practicing answers to see your progress here!
                                </p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
