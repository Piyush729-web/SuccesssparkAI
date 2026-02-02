import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles, LuPenLine } from "react-icons/lu";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";
import AnswerInput from "../AnswerInput";
import AnswerEvaluation from "../AnswerEvaluation";



const QuestionCard = ({
    question, answer, onLearnMore, isPinned, onTogglePin, questionId, onPractice
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isExpanded) {
            if (contentRef.current) {
                const contentHeight = contentRef.current.scrollHeight;
                setHeight(contentHeight + 10);
            }
        } else {
            setHeight(0);
        }
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAnswerSubmit = async (userAnswer) => {
        setIsEvaluating(true);
        try {
            const result = await onPractice(questionId, userAnswer);
            setEvaluation(result);
        } catch (error) {
            console.error("Error evaluating answer:", error);
        } finally {
            setIsEvaluating(false);
        }
    };

    return <>
        <div className={`bg-white dark:bg-gray-800 rounded-xl mb-6 overflow-hidden py-6 px-6 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 border group hover:-translate-y-1 transition-all duration-300 ${isPinned ? 'border-indigo-500 dark:border-indigo-400 ring-1 ring-indigo-500/20' : 'border-gray-100 dark:border-gray-700'}`}>
            <div className="flex items-start justify-between cursor-pointer">
                <div className="flex items-start gap-3.5">
                    <span className={`text-xs md:text-[15px] font-semibold leading-[18px] flex items-center gap-1.5 ${isPinned ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        Q {isPinned && <LuPin className="fill-current text-[10px]" />}
                    </span>
                    <h3
                        className="text-xs md:text-[14px] font-medium text-gray-800 dark:text-gray-200 mr-0 md:mr-20"
                        onClick={toggleExpand}
                    >
                        {question}
                    </h3>
                </div>

                <div className="flex items-center justify-end ml-4 relative">
                    <div
                        className={`flex ${isExpanded ? "md:flex" : "md:hidden group-hover:flex"
                            }
                    `}>
                        <button
                            className="flex items-center gap-2 text-xs text-indigo-800 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 mr-2 rounded-lg text-nowrap border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 dark:hover:border-indigo-700 active:scale-95 transition-all cursor-pointer"
                            onClick={onTogglePin}
                        >
                            {isPinned ? (
                                <LuPinOff className="text-xs" />
                            ) : (
                                <LuPin className="text-xs" />
                            )}
                        </button>

                        <button
                            className="flex items-center gap-2 text-xs text-purple-800 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 mr-2 rounded-lg text-nowrap border border-purple-100 dark:border-purple-800 hover:border-purple-200 dark:hover:border-purple-700 active:scale-95 transition-all cursor-pointer"
                            onClick={() => {
                                setIsExpanded(true);
                                setIsPracticeMode(!isPracticeMode);
                                setEvaluation(null);
                            }}
                        >
                            <LuPenLine />
                            <span className="hidden md:block">Practice</span>
                        </button>

                        <button
                            className="flex items-center gap-2 text-xs text-cyan-800 dark:text-cyan-300 font-medium bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1.5 mr-2 rounded-lg text-nowrap border border-cyan-100 dark:border-cyan-800 hover:border-cyan-200 dark:hover:border-cyan-700 active:scale-95 transition-all cursor-pointer"
                            onClick={() => {
                                setIsExpanded(true);
                                setIsPracticeMode(false);
                                onLearnMore();
                            }}
                        >
                            <LuSparkles />
                            <span className="hidden md:block">Learn More</span>
                        </button>
                    </div>

                    <button
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 active:scale-95 transition-all cursor-pointer"
                        onClick={toggleExpand}
                    >
                        <LuChevronDown
                            size={20}
                            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: `${height}px` }}
            >
                <div
                    ref={contentRef}
                    className="mt-4 text-gray-700 dark:text-gray-300"
                >
                    {isPracticeMode ? (
                        <>
                            {!evaluation && (
                                <AnswerInput
                                    onSubmit={handleAnswerSubmit}
                                    isLoading={isEvaluating}
                                />
                            )}
                            {evaluation && (
                                <AnswerEvaluation evaluation={evaluation} />
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 rounded-lg">
                            <AIResponsePreview content={answer} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
}

export default QuestionCard;