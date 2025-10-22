import { useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import Layout from "./components/Layout.jsx";

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
