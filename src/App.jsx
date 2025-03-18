import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Products from "./pages/Products";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const App = () => {
  const [showLayout, setShowLayout] = useState(true);

  return (
    <Router>
      <MainContent showLayout={showLayout} setShowLayout={setShowLayout} />
    </Router>
  );
};

const MainContent = ({ showLayout, setShowLayout }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/sign-in" || location.pathname === "/sign-up";

  return (
    <div className="flex h-screen">
      {showLayout && !isAuthPage && <Sidebar />}
      <div className="flex-1 bg-gray-100">
        {showLayout && !isAuthPage && <TopBar />}
        <div className="p-6">
          <Routes>
            <Route path="/dashboards" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sign-in" element={<SignIn setShowLayout={setShowLayout} />} />
            <Route path="/sign-up" element={<SignUp setShowLayout={setShowLayout} />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
