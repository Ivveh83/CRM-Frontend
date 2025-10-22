import React from "react";
export default function Header() {
  return (
    <header className="w-full">
      {/* Övre röd rad */}
      <div className="h-9 bg-[#E35C67]"></div>

      {/* Huvudrad med logga */}
      <div className="bg-[#165C6D] flex items-center justify-start px-8 py-3">
        {/* Företagslogga */}
        <div className="flex items-center space-x-3">
            <img src="/logos-nuevo_horizontal-logo-white.png" alt="Logo" className="h-20 w-auto"/>
        </div>
      </div>
    </header>
  );
}
