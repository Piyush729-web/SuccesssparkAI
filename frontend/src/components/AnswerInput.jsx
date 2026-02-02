import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LuSend, LuLoader, LuMic, LuMicOff } from "react-icons/lu";

const AnswerInput = ({ onSubmit, isLoading }) => {
    const [userAnswer, setUserAnswer] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    setUserAnswer(prev => prev + finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
            setIsListening(true);
        }
    };

    const handleSubmit = () => {
        if (userAnswer.trim()) {
            if (isRecording) {
                recognitionRef.current.stop();
                setIsRecording(false);
                setIsListening(false);
            }
            onSubmit(userAnswer);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Answer
                </label>
                <button
                    onClick={toggleRecording}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${isRecording
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isRecording ? (
                        <>
                            <LuMicOff className="text-lg" />
                            <span className="hidden sm:inline">Stop Recording</span>
                            {isListening && (
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            )}
                        </>
                    ) : (
                        <>
                            <LuMic className="text-lg" />
                            <span className="hidden sm:inline">Voice Input</span>
                        </>
                    )}
                </button>
            </div>
            <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here or use voice input..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white"
                rows={6}
                disabled={isLoading}
            />
            <div className="flex justify-end mt-3">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !userAnswer.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? (
                        <>
                            <LuLoader className="animate-spin" />
                            Evaluating...
                        </>
                    ) : (
                        <>
                            <LuSend />
                            Submit Answer
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default AnswerInput;
