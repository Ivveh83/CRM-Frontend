import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm();

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  const onSubmit = async (data) => {
    setErrMsg("");
    setIsLoading(true);

    try {
      // 🔥 Anropa authService.login korrekt med await
      const response = await authService.login(data.username, data.password);

      // Förväntat svar: { accessToken, username, roles }
      const { accessToken, username, roles } = response;

      // 🔥 Spara token
      localStorage.setItem("accessToken", accessToken);

      // 🔥 Uppdatera auth context
      setAuth({ user: username, roles });

      // 🔥 Navigera vidare
      navigate(from, { replace: true });

    } catch (err) {
      if (!err.response) {
        setErrMsg("Ingen kontakt med servern.");
      } else if (err.response.status === 400) {
        setErrMsg("Användarnamn och lösenord krävs.");
      } else if (err.response.status === 401) {
        setErrMsg("Felaktigt användarnamn eller lösenord.");
      } else {
        setErrMsg("Inloggningen misslyckades.");
      }
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
            <input
              type="password"
              disabled={isLoading}
              {...register("password", { required: "Lösenord krävs" })}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none disabled:bg-gray-100"
            />
            {errors.password && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loggar in…" : "Logga in"}
          </button>

          <p className="text-sm mt-4">
            Behöver du ett konto?{" "}
            <span className="line">
              <a href="#" className="text-[#165C6D] underline">Registrera dig</a>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
