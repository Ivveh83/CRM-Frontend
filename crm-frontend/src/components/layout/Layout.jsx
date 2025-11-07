import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="w-64 bg-[#165C6D] text-white" />
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet /> {/* Här renderas de matchande routes */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
