import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ user }) {
  return (
    <aside className="flex flex-col justify-between w-64 bg-black text-white p-4 min-h-full">
      {/* Övre del med länkar */}
      <div className="space-y-4">
        <NavLink
          to="contracts/dashboard"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Kontraktsöversikt
        </NavLink>

        <NavLink
          to="contracts/list"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Lista över kontrakt
        </NavLink>

        <NavLink
          to="subscriptions/list"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Lista över abonnemang
        </NavLink>

        <NavLink
          to="contracts/create"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Skapa nytt kontrakt
        </NavLink>

        <NavLink
          to="resellers/create"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Skapa ny återförsäljare
        </NavLink>

        <NavLink
          to="customers/create"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Skapa ny kund
        </NavLink>

        <NavLink
          to="subscriptions/create"
          className={({ isActive }) =>
            `block px-3 py-2 rounded transition ${
              isActive ? "bg-[#E35C67]" : "hover:bg-[#E35C67]"
            }`
          }
        >
          Skapa nytt abonnemang
        </NavLink>
      </div>

      {/* Nedre del med användarinformation */}
      <div className="space-y-2">
        <div className="text-sm font-medium">
          Inloggad som: Puh Bear (Admin)
          <span className="font-semibold">{user?.name} {user?.role}</span>
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
