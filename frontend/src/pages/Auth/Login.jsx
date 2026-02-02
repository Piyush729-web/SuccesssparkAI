import {useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";


const Login = ({setCurrentPage}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    //Handle Login From Submit
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if(!password) {
            setError("Password is required");
            return;
        }

        setError("");

        //Login API Call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
                email,
                password
            });

        const {token} = response.data;
        if(token){
            localStorage.setItem("token",token);
            updateUser(response.data);
            navigate("/dashboard")
        }
        } catch (error)
        {
            if(error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className="max-w-md w-full mx-auto mt-16 bg-white shadow-lg rounded-lg p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-black mb-2">Welcome Back</h3>
            <p className="text-sm text-gray-700 mb-8">
                Please enter your details to log in
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
                <Input 
                    value={email}
                    onChange={({target}) => setEmail(target.value)}
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                />
                <Input 
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                />

                {error && <p className="text-orange-400 text-xs">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-900 transition-colors duration-200"
                >
                    LOGIN
                </button>
                <p className="text-sm text-gray-700 mt-4 text-center">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        className="font-medium text-orange-500 underline hover:text-orange-700"
                        onClick={() => setCurrentPage("signup")}
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Login;