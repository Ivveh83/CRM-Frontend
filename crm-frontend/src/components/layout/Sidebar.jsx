import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ user }) {
  const linkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
    }`;

  return (
    <aside className="flex flex-col justify-between w-64 bg-black text-white p-4 min-h-full">
      {/* Övre del med navigering */}
         {/* 📋 DASHBOARDS */}
      <div>
             <h3 className="uppercase text-sm tracking-wide text-gray-400 mb-2 mt-8 pl-1">
        Dashboards
      </h3>
      <div className="space-y-8">
        <NavLink to="contracts/dashboard" className={linkClasses}>
          Kontraktsöversikt
        </NavLink>
      </div>
        {/* 📋 LISTOR */}
        <div>
          <h3 className="uppercase text-sm tracking-wide text-gray-400 mb-2 pl-1">
            Listor
          </h3>
          <div className="space-y-1">
            <NavLink to="contracts/list" className={linkClasses}>
              Lista över kontrakt
            </NavLink>
            <NavLink to="subscriptions/list" className={linkClasses}>
              Lista över abonnemang
            </NavLink>
          </div>
        </div>

        {/* 🧩 SKAPA */}
        <div>
          <h3 className="uppercase text-sm tracking-wide text-gray-400 mb-2 pl-1">
            Skapa
          </h3>
          <div className="space-y-1">
            <NavLink to="contracts/create" className={linkClasses}>
              Skapa nytt kontrakt
            </NavLink>
            <NavLink to="resellers/create" className={linkClasses}>
              Skapa ny återförsäljare
            </NavLink>
            <NavLink to="customers/create" className={linkClasses}>
              Skapa ny kund
            </NavLink>
            <NavLink to="subscriptions/create" className={linkClasses}>
              Skapa nytt abonnemang
            </NavLink>
          </div>
        </div>
      </div>

      {/* 👤 Användarinformation längst ned */}
      <div className="space-y-2 border-t border-gray-800 pt-4">
        <div className="text-sm text-gray-300">
          Inloggad som:{" "}
          <span className="font-semibold text-white">
            {user?.name || "Puh Bear"} ({user?.role || "Admin"})
          </span>
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
