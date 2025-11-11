import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Inloggningsdata:", data);
    alert(`Välkommen tillbaka, ${data.username}!`);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-[#165C6D] mb-6 text-center">
          Logga in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Användarnamn */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Användarnamn
            </label>
            <input
              type="text"
              {...register("username", { required: "Användarnamn krävs" })}
              placeholder="Ex. akarlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.username && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Lösenord */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lösenord
            </label>
            <input
              type="password"
              {...register("password", { required: "Lösenord krävs" })}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-[#E35C67] mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
