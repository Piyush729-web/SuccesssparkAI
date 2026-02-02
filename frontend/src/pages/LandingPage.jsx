import { useState } from "react";

import HERO_IMG from "../assets/hero-img.png";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard.jsx";

const LandingPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [openAuthModel, setOpenAuthModel] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    const handleCTA = () => {
        if (!user) {
            setOpenAuthModel(true);
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <>
            <div className="w-full min-h-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pb-36 font-inter selection:bg-purple-100 selection:text-purple-900">
                <div className="container mx-auto px-6 pt-8 pb-32 relative z-10">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-20 md:mb-28">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                <LuSparkles />
                            </div>
                            <span className="text-xl md:text-2xl text-gray-900 font-bold tracking-tight">
                                Success Spark AI
                            </span>
                        </div>

                        {user ? (
                            <ProfileInfoCard />
                        ) : (
                            <button
                                className="bg-gray-900 text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-gray-200"
                                onClick={() => setOpenAuthModel(true)}
                            >
                                Login / Sign Up
                            </button>
                        )}
                    </header>

                    {/* Hero Content */}
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                        <div className="w-full md:w-1/2">
                            <div className="inline-flex items-center gap-2 text-sm text-purple-700 font-medium bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 mb-8 animate-fade-in-up">
                                <LuSparkles className="text-purple-600" />
                                <span>AI-Powered Interview Coach</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                                Ace Interviews with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 animate-gradient-x">
                                    Intelligent
                                </span>{" "}
                                Preparation
                            </h1>

                            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
                                Master your interview skills with role-specific questions, instant AI feedback,
                                and personalized concept explanations. Your personal coach, available 24/7.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-gray-800 hover:translate-y-[-2px] hover:shadow-xl shadow-gray-900/20 active:scale-95 transition-all duration-300"
                                    onClick={handleCTA}
                                >
                                    Start Practicing Now
                                </button>

                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/40 via-blue-200/40 to-pink-200/40 rounded-[2rem] blur-3xl -z-10" />
                            <img
                                src={HERO_IMG}
                                alt="Dashboard Preview"
                                className="w-full rounded-2xl shadow-2xl shadow-purple-900/10 border border-white/50 backdrop-blur-sm rotate-1 hover:rotate-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="w-full bg-gray-50 border-t border-gray-100 py-24 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Everything you need to succeed
                            </h2>
                            <p className="text-lg text-gray-600">
                                Our AI-driven platform provides a comprehensive toolkit to help you prepare smarter, not harder.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {APP_FEATURES.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <LuSparkles className="text-xl text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="bg-white border-t border-gray-100 py-12">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-gray-500 font-medium">
                            Made with ❤️ for developers by developers
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            © {new Date().getFullYear()} Success Spark AI. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>

            <Modal
                isOpen={openAuthModel}
                onClose={() => {
                    setOpenAuthModel(false);
                    setCurrentPage("login");
                }}
                hideHeader={true}
            >
                <div>
                    {currentPage === "login" && (
                        <Login setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "signup" && (
                        <SignUp setCurrentPage={setCurrentPage} />
                    )}
                </div>
            </Modal>
        </>
    );
}

export default LandingPage;
