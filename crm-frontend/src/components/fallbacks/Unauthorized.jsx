import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-10 border border-gray-100 max-w-md text-center">
        <h1 className="text-3xl font-bold text-[#E35C67] mb-4">
          Åtkomst nekad
        </h1>
        <p className="text-gray-600 mb-8">
          Du har inte behörighet att visa den här sidan.<br />
          Kontakta administratören om du tror att det är ett misstag.
        </p>

        <button
          onClick={goBack}
          className="px-6 py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] transition"
        >
          ← Tillbaka
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
