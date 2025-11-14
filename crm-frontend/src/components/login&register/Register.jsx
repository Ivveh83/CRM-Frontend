import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Registrering:", data);
    alert(`Konto för "${data.username}" har skapats!`);
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
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
            <input
              type="password"
              {...register("password", {
                required: "Lösenord krävs",
                minLength: { value: 6, message: "Minst 6 tecken" },
              })}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Bekräfta lösenord */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bekräfta lösenord
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Bekräfta lösenord krävs",
                validate: (value) =>
                  value === watch("password") || "Lösenorden matchar inte",
              })}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Skicka */}
          <button
            type="submit"
            className="w-full py-2 bg-[#E35C67] text-white font-semibold rounded-lg shadow hover:bg-[#f1707a] focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            Skapa konto
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
