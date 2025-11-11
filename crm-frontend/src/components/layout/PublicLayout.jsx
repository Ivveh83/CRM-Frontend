import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

{/* Saknar Sidebar till skillnad från MainLayout */}
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet /> {/* Här renderas de matchande routes */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;