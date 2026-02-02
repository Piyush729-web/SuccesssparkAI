import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/questionCard";
import AIResponsePreview from "./components/AIResponsePreview";
import Drawer from "../../components/Drawer";

import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false); // AI explanation loader
  const [isUpdateLoader, setIsUpdateLoader] = useState(false); // Load more Qs
  const [isSessionLoading, setIsSessionLoading] = useState(false); // Initial fetch

  // ---------------- FETCH SESSION ----------------
  const fetchSessionDetailsById = async () => {
    try {
      setIsSessionLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data?.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      toast.error("Failed to load session details");
    } finally {
      setIsSessionLoading(false);
    }
  };

  // ---------------- GENERATE CONCEPT EXPLANATION ----------------
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Try again later.");
      toast.error("Failed to generate explanation");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- PIN / UNPIN QUESTION ----------------
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      if (response.data?.question) {
        toast.success(
          response.data.question.isPinned
            ? "Question Pinned"
            : "Question Unpinned"
        );
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update pin status");
    }
  };

  // ---------------- LOAD MORE QUESTIONS ----------------
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      setErrorMsg("");

      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicToFocus, // ✅ FIXED: Mapped from DB field (singular)
          numberOfQuestion: 10,
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );

      if (response.data) {
        toast.success("More questions added!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsUpdateLoader(false);
    }
  };

  // ---------------- PRACTICE ANSWER EVALUATION ----------------
  const handlePracticeAnswer = async (questionId, userAnswer) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.ANSWER.EVALUATE,
        {
          questionId,
          userAnswer,
        }
      );

      if (response.data?.evaluation) {
        toast.success("Answer evaluated!");
        return response.data.evaluation;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to evaluate answer");
      throw error;
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  // ---------------- RENDER ----------------
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY, h:mm a")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold text-black">
          Interview Q & A
        </h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
              }`}
          >
            {isSessionLoading ? (
              <SkeletonLoader count={3} />
            ) : (
              <AnimatePresence>
                {sessionData?.questions?.length > 0 ? (
                  sessionData.questions.map((data, index) => (
                    <motion.div
                      key={data._id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05,
                      }}
                      layout
                    >
                      <QuestionCard
                        question={data.question}
                        answer={data.answer}
                        isPinned={data.isPinned}
                        questionId={data._id}
                        onLearnMore={() =>
                          generateConceptExplanation(data.question)
                        }
                        onTogglePin={() =>
                          toggleQuestionPinStatus(data._id)
                        }
                        onPractice={handlePracticeAnswer}
                      />

                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No questions found for this session.
                  </p>
                )}
              </AnimatePresence>
            )}

            {!isLoading && !isSessionLoading && sessionData?.questions?.length > 0 && (
              <div className="flex items-center justify-center mt-8 mb-10">
                <button
                  className="flex items-center gap-3 text-sm text-white font-medium bg-black dark:bg-white dark:text-black px-6 py-2.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdateLoader}
                  onClick={uploadMoreQuestions}
                >
                  {isUpdateLoader ? (
                    <SpinnerLoader />
                  ) : (
                    <LuListCollapse className="text-lg" />
                  )}
                  Load More Questions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- DRAWER ---------------- */}
        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title="Concept Explanation"
        >
          {errorMsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" />
              {errorMsg}
            </p>
          )}

          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && (
            <AIResponsePreview content={explanation.explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;