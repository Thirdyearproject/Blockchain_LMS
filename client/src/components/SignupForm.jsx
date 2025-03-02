import { React, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  resetSignupData,
  setSignupData,
  setSignup,
  setUser,
} from "../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { UserSignup } from "../services/operations/authApi";

function SignupForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validatePassword = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/\d/.test(value)) return "Password must include at least one number";
    if (!/[a-z]/.test(value))
      return "Password must include at least one lowercase letter";
    if (!/[A-Z]/.test(value))
      return "Password must include at least one uppercase letter";
    if (!/[!@#$%^&*]/.test(value))
      return "Password must include at least one special character";
    return true;
  };

  async function onSubmit(data) {
    try {
      const result = await UserSignup(data);
      if (result) {
        dispatch(setUser(result));
        localStorage.setItem("lmsuser", JSON.stringify(result));
        dispatch(resetSignupData(null));

        dispatch(setSignupData(data));
        dispatch(setSignup(true));
        navigate("/");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup", error);
    }
    console.log(data);
  }
  return (
    <div className="p-5  mt-10 w-full bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-6"
      >
        <div>
          <label htmlFor="userName" className="lable-class">
            userName
          </label>
          <input
            type="text"
            autoComplete="off"
            name="userName"
            id="userName"
            className="input-class"
            {...register("userName", {
              required: { value: true, message: "userName is required" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]/,
                message: "Invalid userName ",
              },
            })}
          />
          {errors.email && (
            <span className="error-style">{errors.email.message}</span>
          )}
        </div>
        <div className="relative">
          <label htmlFor="password" className="lable-class">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              name="password"
              id="password"
              className="input-class"
              {...register("password", {
                required: "Password is Required",
                validate: validatePassword,
              })}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <LuEyeOff
                className="absolute right-[3%] cursor-pointer top-[30%] text-gray-500"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <LuEye
                className="absolute right-[3%] cursor-pointer top-[30%] text-gray-500"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.password && (
            <span className="error-style">{errors.password.message}</span>
          )}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="lable-class">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              name="confirmPassword"
              id="confirmPassword"
              className="input-class"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <span className="error-style">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <button
            onSubmit={handleSubmit(onSubmit)}
            type="submit"
            className="px-6 w-full py-3 rounded-xl mt-2 font-semibold text-white hover:scale-95 transition-all duration-400 ease-in-out bg-[#22a7f1] shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
