import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <Header />

      {/* HUVUDINNEHÅLL */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar className="w-64 bg-[#165C6D] text-white" />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>

      {/* FOOTER (STRÄCKER SIG UNDER ALLT) */}
      <Footer />
    </div>
  );
};

export default Layout;
