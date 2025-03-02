import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { UserLogin } from "../services/operations/authApi";
import { setToken, setUser } from "../redux/Slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    const email = params.get("email");
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      console.log(token, user);
      try {
        const decodedUser = JSON.parse(decodeURIComponent(user));

        localStorage.setItem("lmstoken", token);
        localStorage.setItem("lmsuser", JSON.stringify(decodedUser));

        dispatch(setToken(token));
        dispatch(setUser(decodedUser));

        const redirectPath = "/dashboard/my-dashboard";
        navigate(redirectPath);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }

    if (error) {
      switch (error) {
        case "exists_with_password":
          setAuthError(
            <div className="flex flex-col">
              <div>
                This email ({email}) already exists with password login.
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span>Please use your password to login or</span>
                <button
                  onClick={() => {
                    const emailInput = document.getElementById("email");
                    if (emailInput) emailInput.value = email;
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  click here to login with password
                </button>
              </div>
            </div>
          );
          break;
        case "auth_failed":
          setAuthError(
            "Authentication failed. Please try again or use password login."
          );
          break;
        case "email_exists":
          setAuthError(
            "This email is already registered. Please login with your existing account."
          );
          break;
        default:
          setAuthError("An error occurred during login. Please try again.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setAuthError("");
    }
  }, [location.search]);

  async function onSubmit(data) {
    try {
      const result = await UserLogin(data);
      if (result?.token && result?.user) {
        localStorage.setItem("lmstoken", JSON.stringify(result.token));
        localStorage.setItem("lmsuser", JSON.stringify(result.user));

        dispatch(setToken(result.token));
        dispatch(setUser(result.user));

        navigate("/dashboard/my-dashboard");
      } else {
        console.error("Invalid login response:", result);
      }
    } catch (err) {
      console.error("Login error:", err.message);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="lg:w-1/2 w-full flex items-center justify-center bg-[#f9fafa]">
        <div className="lg:w-[500px] w-[400px]">
          <div className="flex items-center gap-4">
            <div className="w-32 h-12">
              <img
                src="/logo.png"
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold">LOGIN</h1>
              <p className="text-gray-600">Hello, welcome back!</p>
            </div>
          </div>
          {/* white bg wala div */}
          <div className="p-5 mt-10 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-2xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-6"
            >
              <div>
                <label htmlFor="email" className="lable-class">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input-class"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="error-style">{errors.email.message}</span>
                )}
              </div>
              <div>
                <label htmlFor="password" className="lable-class">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    name="password"
                    id="password"
                    className="input-class relative"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is Required",
                      },
                      minLength: {
                        value: 4,
                        message: "Password must be at least 4 characters",
                      },
                    })}
                  />
                  {showPassword ? (
                    <LuEyeOff
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <LuEye
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {errors.password && (
                  <span className="error-style">{errors.password.message}</span>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col">
                  <p className="font-semibold text-[14px] text-gray-500">
                    Don't have an account?
                  </p>
                  <Link
                    to={"/signup"}
                    className="underline text-sm text-[#22a7f1] font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
                <div>
                  <button
                    onSubmit={handleSubmit(onSubmit)}
                    type="submit"
                    className="px-6 py-3 rounded-xl font-semibold text-white hover:scale-95 transition-all duration-200 ease-in-out bg-[#22a7f1]"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
