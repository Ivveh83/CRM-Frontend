import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import Layout from "./components/layout/Layout.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
</BrowserRouter>
  );
}

export default App;
