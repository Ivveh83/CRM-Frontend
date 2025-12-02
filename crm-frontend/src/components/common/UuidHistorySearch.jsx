// src/components/Common/UuidHistorySearch.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UuidHistorySearch({ basePath }) {
  const [uuid, setUuid] = useState("");
  const navigate = useNavigate();

  const goToHistory = () => {
    if (!uuid.trim()) return;
    navigate(`/${basePath}/${uuid.trim()}/history`);
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Sök historik via ID-nr…"
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
        className="
          border border-[#165C6D]/40 hover:border-[#165C6D]/70
          bg-white text-black rounded-md px-3 py-1.5 text-sm
          focus:outline-none focus:border-[#165C6D]
          w-52
        "
      />

      <button
        onClick={goToHistory}
        className="bg-[#165C6D] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#124a54] transition"
      >
        Sök
      </button>
    </div>
  );
}
