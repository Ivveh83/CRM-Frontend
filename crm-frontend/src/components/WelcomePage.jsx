import React from "react";
import { motion } from "framer-motion";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white rounded-2xl shadow-md p-10 border border-gray-100 text-center">
      {/* Enkel animation */}
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

      {/* Dekorativ ikon eller logotyp */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10"
      >
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#165C6D]/10 border border-[#165C6D]/20">
          <span className="text-5xl text-[#165C6D]">💼</span>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
