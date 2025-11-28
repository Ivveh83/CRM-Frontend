import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

const WelcomePage = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    setErrorMessage(null); // rensa tidigare fel

    const formData = new FormData();
    formData.append("dbFile", data.dbFile[0]);
    formData.append("key", data.key);

    try {
      // Senare ersätter vi denna del med riktig backend:
      const res = await fetch("/api/db/connect", {
        method: "POST",
        body: formData
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error || "Ett okänt fel uppstod");
        return;
      }

      // Allt OK → fortsätt t.ex. till dashboard
      console.log("Database connected!", json);

    } catch (err) {
      setErrorMessage("Kunde inte ansluta till servern");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white rounded-2xl shadow-md p-10 border border-gray-100 text-center max-w-2xl mx-auto">
      
      {/* -------- Välkomstdelen -------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-[#165C6D] mb-4">
          Välkommen till CRM-systemet
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Du är nu inloggad.  
          Hantera dina kunder, kontrakt och abonnemang snabbt och enkelt — allt på ett ställe.
        </p>
      </motion.div>

      {/* -------- Ikon -------- */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 mb-10"
      >
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#165C6D]/10 border border-[#165C6D]/20">
          <span className="text-5xl text-[#165C6D]">💼</span>
        </div>
      </motion.div>

      {/* -------- Formuläret -------- */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-col gap-6 w-full text-left"
      >
        {/* Database file */}
        <div>
          <label className="font-medium text-gray-700">SQLite-databas</label>
          <input
            type="file"
            accept=".db,.sqlite"
            {...register("dbFile", { required: "Du måste välja en databasfil" })}
            className="mt-1 block w-full border rounded-lg px-3 py-2"
          />
          {errors.dbFile && (
            <p className="text-red-500 text-sm">{errors.dbFile.message}</p>
          )}
        </div>

        {/* Key */}
        <div>
          <label className="font-medium text-gray-700">Krypteringsnyckel</label>
          <input
            type="password"
            placeholder="Ange krypteringsnyckel"
            {...register("key", {
              required: "En krypteringsnyckel krävs",
              minLength: { value: 4, message: "Minst 4 tecken" }
            })}
            className="mt-1 block w-full border rounded-lg px-3 py-2"
          />
          {errors.key && (
            <p className="text-red-500 text-sm">{errors.key.message}</p>
          )}
        </div>

        {/* -------- FELMEDDELANDE (backend) -------- */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#165C6D] text-white rounded-lg py-3 text-lg hover:bg-[#0f3f4b] transition"
        >
          {isSubmitting ? "Ansluter..." : "Anslut till databas"}
        </button>
      </motion.form>
    </div>
  );
};

export default WelcomePage;
