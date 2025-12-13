import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";

const ForgotPassword = () => {
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
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
    setSuccessMsg("");
    setIsLoading(true);

    try {
        console.log("Resetting password for:", data.username);
      await userService.resetPassword(data.username);

      // Neutralt svar – avslöjar inget
      setSuccessMsg(
        "Om användaren finns har ett nytt lösenord skapats. Kontakta administratör för vidare instruktioner."
      );
    } catch (error) {
      setErrMsg("Något gick fel. Försök igen senare.");
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

        {/* Success */}
        {successMsg && (
          <p className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded-lg">
            {successMsg}
          </p>
        )}

        <h2 className="text-2xl font-bold text-[#165C6D] mb-6 text-center">
          Glömt lösenord
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
              {...register("username", {
                required: "Användarnamn krävs",
              })}
              placeholder="Ex. akarlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none disabled:bg-gray-100"
            />
            {errors.username && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Återställer…" : "Återställ lösenord"}
          </button>

          <p className="text-sm mt-4 text-gray-600 text-center">
            Kom du på det igen?{" "}
            <Link to="/login" className="text-[#165C6D] underline">
              Tillbaka till inloggning
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
