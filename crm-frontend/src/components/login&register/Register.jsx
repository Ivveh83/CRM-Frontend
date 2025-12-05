import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService.js";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

const onSubmit = async (data) => {
  try {
    await userService.registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    navigate("/login");
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.errors?.join(", ") ||
      "Ett fel uppstod vid skapandet av användaren.";

    alert(msg);
  }
};


  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-[#165C6D] mb-6 text-center">
          Registrera konto
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Användarnamn */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Användarnamn
            </label>
            <input
              type="text"
              {...register("username", {
                required: "Användarnamn krävs",
                minLength: { value: 4, message: "Minst 4 tecken" },
              })}
              placeholder="Ex. akarlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.username && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* E-post */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-postadress
            </label>
            <input
              type="email"
              {...register("email", {
                required: "E-post krävs",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Ogiltig e-postadress",
                },
              })}
              placeholder="Ex. anna@företag.se"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.email && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Lösenord */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lösenord
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Lösenord krävs",
                  minLength: { value: 6, message: "Minst 6 tecken" },
                })}
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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

          {/* Bekräfta lösenord */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bekräfta lösenord
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Bekräfta lösenord krävs",
                  validate: (value) =>
                    value === watch("password") || "Lösenorden matchar inte",
                })}
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Skicka */}
          <button
            type="submit"
            className="w-full py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a]"
          >
            Skapa konto
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
