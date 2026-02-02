import {useState}  from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
const SignUp = ({
    setCurrentPage
}) => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    //handle Sign Up Form Submit
    const handleSignUp = async (e) => {
        e.preventDefault();
        // Add your sign-up logic here

        let profileImageUrl = "";

        if(!fullName) {
            setError("Please enter your full name");
            return;
        }
        if(!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if(!password) {
            setError("Please enter a password");
            return;
        }
        setError("");
        // Sign Up API Call
         try {
            //upload image if present
            if(profilePic){
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
                name: fullName,
                email,
                password,
                profileImageUrl: profileImageUrl,
            });

            const {token} = response.data;
            if(token){
                localStorage.setItem("token",token);
                updateUser(response.data);
                navigate("/dashboard");
            }
        } catch (error) {
            if(error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    
    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">Create an Account</h3>
            <p className="text-gray-600 mb-6 text-center">
                Join us today by entering your details below
            </p>

            <form onSubmit={handleSignUp}>

                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                <div className="space-y-4">
                    <Input 
                        value={fullName}
                        onChange={({target}) => setFullName(target.value)}
                        label="Full Name"
                        placeholder="Enter your full name"
                        type="text"
                    />
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
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                    type="submit"
                    className="w-full mt-6 bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded transition duration-200"
                >
                    SIGN UP
                </button>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-orange-500 hover:underline font-medium"
                        onClick={() => setCurrentPage("login")}
                    >
                        Login
                    </button>
                </p>    
            </form>
        </div>
    )
}

export default SignUp;