import {useState} from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({
    value="",
    onChange,
    label,
    placeholder,
    type
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-800 mb-1 font-medium">{label}</label>
            <div className="flex items-center border border-slate-300 rounded-lg px-3 py-2 bg-white focus-within:border-orange-500 transition">
                <input
                    type={
                        type === "password" ? (showPassword ? "text" : "password") : type
                    }
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none text-base text-slate-800"
                    value={value}
                    onChange={onChange}
                />
                {type === "password" && (
                    showPassword ? (
                        <FaRegEye
                            size={20}
                            className="text-orange-500 cursor-pointer ml-2"
                            onClick={toggleShowPassword}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={20}
                            className="text-orange-400 cursor-pointer ml-2"
                            onClick={toggleShowPassword}
                        />
                    )
                )}
            </div>
        </div>
    );
}

export default Input;