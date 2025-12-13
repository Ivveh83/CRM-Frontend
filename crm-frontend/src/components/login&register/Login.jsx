import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  const onSubmit = async (data) => {
    setErrMsg("");
    setIsLoading(true);

    try {
      const response = await authService.login(data.username, data.password);
      const { username, roles } = response;
      setAuth({ user: username, roles });
      navigate(from, { replace: true });
    } catch (err) {
      setErrMsg(err.message || "Inloggning misslyckades");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">
        {/* Felmeddelande */}
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <h2 className="text-2xl font-bold text-[#165C6D] mb-6 text-center">
          Logga in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Användarnamn
            </label>
            <input
              type="text"
              disabled={isLoading}
              {...register("username", { required: "Användarnamn krävs" })}
              placeholder="Ex. akarlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none disabled:bg-gray-100"
            />
            {errors.username && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lösenord
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                {...register("password", { required: "Lösenord krävs" })}
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none disabled:bg-gray-100"
              />

              {/* Ögon-knappen */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#165C6D] hover:underline"
            >
              Glömt lösenord?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loggar in…" : "Logga in"}
          </button>

          <p className="text-sm mt-4 text-gray-600 text-center">
            Behöver du ett konto?{" "}
            <Link to="/register" className="text-[#165C6D] underline">
              Registrera dig
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
