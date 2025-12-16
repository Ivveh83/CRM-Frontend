import React from "react";
import { NavLink } from "react-router-dom";
import { authService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import { databaseService } from "../../services/databaseService";
import { set } from "react-hook-form";

export default function Sidebar() {
  const { auth, setAuth } = useAuth();
  const { setActiveDbKey } = useAuth();
  const linkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
    }`;
  const smallLinkClasses =
    "block px-3 py-2 rounded hover:bg-[#E35C67] transition text-sm";

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
            <NavLink to="customers/list" className={linkClasses}>
              Lista över kunder
            </NavLink>
            <NavLink to="resellers/list" className={linkClasses}>
              Lista över återförsäljare
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
        <div>
          <h3 className="uppercase text-sm tracking-wide text-gray-400 mb-2 pl-1">
            AI
          </h3>
          <NavLink to="ai/chat" className={linkClasses}>
            AI Chatt
          </NavLink>
        </div>
        <div>
          <h3 className="uppercase text-sm tracking-wide text-gray-400 mb-2 pl-1">
            INSTÄLLNINGAR
          </h3>
          <NavLink to="settings/dropdown-settings" className={linkClasses}>
            Rullgardiner för kund och abonnemang
          </NavLink>
          <NavLink to="settings/user-management" className={linkClasses}>
            Användare och roller
          </NavLink>
          <NavLink to="settings/database-settings" className={linkClasses}>
            Databashantering
          </NavLink>
          <h3 className="uppercase text-sm tracking-wide text-gray-400 mb-2 pl-1">
            STARTSIDA
          </h3>
          <NavLink to="home" className={linkClasses}>
            Hem
          </NavLink>
        </div>
      </div>

      {/* 👤 Användarinformation längst ned */}
      <div className="space-y-2 border-t border-gray-800 pt-4">
        <div className="text-sm text-gray-300">
          Inloggad som:{" "}
          <span className="font-semibold text-white">
            {auth?.user || "xxxx zzzz"}
          </span>
          <br />
          Roll(er):{" "}
          <span className="font-semibold text-white">
            {auth?.roles?.join(", ") || "Gäst"}
          </span>
        </div>
        <NavLink to="/settings/change-password" className={smallLinkClasses}>
          Byta lösenord
        </NavLink>
        <button
          className="w-full text-left px-3 py-2 rounded hover:bg-[#E35C67] transition text-sm"
          onClick={async () => {
            try {
              await databaseService.disconnectFromDatabase();
            } finally {
              authService.logout();
              setActiveDbKey(null);
              setAuth({});
            }
          }}
        >
          Logga ut
        </button>
      </div>
    </aside>
  );
}
