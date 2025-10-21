import React from "react";

export default function Sidebar({ user }) {
  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-black text-white p-4">
      
      {/* Övre del med länkar */}
      <div className="space-y-4">
        <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition"
        >
          Kontraktsöversikt 
        </a>
        <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition"
        >
          Lista över abonnemang
        </a>
        <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition"
        >
          Skapa nytt kontrakt
        </a>
        <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition"
        >
          Skapa ny reseller
        </a>
        <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition"
        >
          Skapa ny kund
        </a>
         <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition"
        >
          Skapa nytt abonnemang
        </a>
      </div>

      {/* Nedre del med användarinformation */}
      <div className="space-y-2">
        <div className="text-sm font-medium">
          Inloggad som: Javier Carriazo<span className="font-semibold">{user?.name}</span>
        </div>
        <a
          href="#"
          className="block px-3 py-2 rounded hover:bg-[#E35C67] transition text-sm"
        >
          Byta lösenord
        </a>
        <button
          className="w-full text-left px-3 py-2 rounded hover:bg-[#E35C67] transition text-sm"
          onClick={() => alert("Loggar ut...")}
        >
          Logga ut
        </button>
      </div>
    </aside>
  );
}
