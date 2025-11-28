import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { userService } from "../../services/userService";
import useAuth from "../../hooks/useAuth";

export default function ChangePassword() {
  const { auth } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("newPassword");

  // 🔵 Visa/dölj states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    const username = auth.user;

    try {
      await userService.changePassword(username, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      alert("Lösenordet har uppdaterats!");
      reset();
    } catch (err) {
      alert(err.message || "Misslyckades att uppdatera lösenordet.");
    }
  };

  // 🔵 Reusable password field component
  const PasswordField = ({
    label,
    name,
    show,
    setShow,
    registerOptions,
    error,
    watchValue,
  }) => (
    <div>
      <label className="block text-sm">{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name, registerOptions)}
          className="w-full mt-1 px-4 py-2 border rounded-lg"
        />

        {/* Toggle-knapp */}
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error.message}</p>}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">Byt lösenord</h2>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

        {/* Nuvarande lösenord */}
        <PasswordField
          label="Nuvarande lösenord"
          name="currentPassword"
          show={showCurrent}
          setShow={setShowCurrent}
          registerOptions={{ required: "Obligatoriskt" }}
          error={errors.currentPassword}
        />

        {/* Nytt lösenord */}
        <PasswordField
          label="Nytt lösenord"
          name="newPassword"
          show={showNew}
          setShow={setShowNew}
          registerOptions={{
            required: "Obligatoriskt",
            minLength: { value: 8, message: "Minst 8 tecken" },
          }}
          error={errors.newPassword}
        />

        {/* Bekräfta nytt lösenord */}
        <PasswordField
          label="Bekräfta nytt lösenord"
          name="confirmPassword"
          show={showConfirm}
          setShow={setShowConfirm}
          registerOptions={{
            required: "Obligatoriskt",
            validate: (value) =>
              value === newPassword || "Lösenorden matchar inte",
          }}
          error={errors.confirmPassword}
        />

        <button
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg text-white font-semibold shadow ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#165C6D] hover:bg-[#1f7585]"
          }`}
        >
          {isSubmitting ? "Uppdaterar..." : "Byt lösenord"}
        </button>
      </form>
    </div>
  );
}
