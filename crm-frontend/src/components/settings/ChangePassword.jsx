import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { userService } from "../../services/userService";
import useAuth from "../../hooks/useAuth";

/* 🔵 REUSABLE PASSWORD FIELD (DEFINED OUTSIDE THE MAIN COMPONENT)
   Defining this outside prevents the input from losing focus on re-render */
const PasswordField = ({
  label,
  name,
  show,
  setShow,
  register,
  registerOptions,
  error,
}) => (
  <div>
    {/* Field label */}
    <label className="block text-sm">{label}</label>

    <div className="relative">
      {/* Password input */}
      <input
        type={show ? "text" : "password"}
        {...register(name, registerOptions)}
        className="w-full mt-1 px-4 py-2 border rounded-lg"
        autoComplete={
          name === "currentPassword"
            ? "current-password"
            : "new-password"
        }
      />

      {/* Toggle show / hide password */}
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {/* Validation error message */}
    {error && <p className="text-red-600 text-sm">{error.message}</p>}
  </div>
);

/* 🔵 MAIN COMPONENT */
export default function ChangePassword() {
  const { auth } = useAuth();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch new password to validate confirmation field
  const newPassword = watch("newPassword");

  // State for showing / hiding password fields
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle form submission
  const onSubmit = async (data) => {
    const username = auth.user;

    try {
      await userService.changePassword(username, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      alert("Password has been updated!");
      reset(); // Reset form after success
    } catch (err) {
      alert(err.message || "Failed to update password.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-[#165C6D] mb-6">
        Change password
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Current password */}
        <PasswordField
          label="Current password"
          name="currentPassword"
          show={showCurrent}
          setShow={setShowCurrent}
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.currentPassword}
        />

        {/* New password */}
        <PasswordField
          label="New password"
          name="newPassword"
          show={showNew}
          setShow={setShowNew}
          register={register}
          registerOptions={{
            required: "Required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          }}
          error={errors.newPassword}
        />

        {/* Confirm new password */}
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          show={showConfirm}
          setShow={setShowConfirm}
          register={register}
          registerOptions={{
            required: "Required",
            validate: (value) =>
              value === newPassword || "Passwords do not match",
          }}
          error={errors.confirmPassword}
        />

        {/* Submit button */}
        <button
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg text-white font-semibold shadow ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#165C6D] hover:bg-[#1f7585]"
          }`}
        >
          {isSubmitting ? "Updating..." : "Change password"}
        </button>
      </form>
    </div>
  );
}
