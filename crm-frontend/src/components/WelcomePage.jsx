import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MilagroLogo from "../../public/thumbnail_image002.png";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white rounded-2xl shadow-md p-10 border border-gray-100 text-center max-w-2xl mx-auto">
      
            {/* -------- Logo (cool version) -------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-16"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-full blur-2xl bg-[#165C6D]/20" />

        {/* Logo container */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-40 h-40 bg-black rounded-2xl flex items-center justify-center shadow-lg border border-[#165C6D]/20"
        >
          <img
            src={MilagroLogo}
            alt="Milagro"
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        </motion.div>
      </motion.div>

      {/* -------- Välkomstdelen -------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-[#165C6D] mb-4">
          Välkommen till CRMilagro
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Du är nu inloggad.  
          Hantera dina kunder, kontrakt och abonnemang snabbt och enkelt — allt på ett ställe.
        </p>
      </motion.div>



      {/* -------- Settings card -------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 w-full"
      >
        <Link to="/settings/database-settings">
          <motion.div
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-5 p-5 rounded-xl border border-gray-200 bg-gradient-to-r from-white to-[#165C6D]/5 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-[#165C6D]/10 flex items-center justify-center text-xl">
              🗄️
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-[#165C6D]">
                Databasinställningar
              </h3>
              <p className="text-sm text-gray-600">
                Konfigurera och hantera databaskopplingar
              </p>
            </div>

            <div className="ml-auto text-[#165C6D] text-xl">→</div>
          </motion.div>
        </Link>
      </motion.div>

    </div>
  );
};

export default WelcomePage;
