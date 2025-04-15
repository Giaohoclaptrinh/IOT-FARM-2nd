import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Layout components
import Sidebar from "./components/SideBar/Sidebar";
import TopBar from "./components/TopBar and Search/TopBar";

// Auth pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Main pages
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Products from "./pages/Products";
import ProfileSettings from "./pages/ProfileSettings";
import UserPage from "./pages/User";

// Device-related components
import DeviceOverview from "./components/Devices/DeviceOverview";
import DeviceDetail from "./components/Devices/DeviceDetail";
import ControlsDevice from "./pages/ControlsDevice";

// Things (Pages + Devices inside Page)
import Things from "./pages/Things";

// Others
import TestAddPage from "./components/Devices/TestAddPage";
// import ChatBox from "@/components/Chatbox/Chatbox.jsx"; 

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

  // Xác định nếu là trang auth (ẩn layout)
  const isAuthPage = useMemo(() => {
    return ["/sign-in", "/sign-up"].includes(location.pathname);
  }, [location.pathname]);

  // Cập nhật layout khi chuyển route
  useEffect(() => {
    setShowLayout(!isAuthPage);
  }, [isAuthPage, setShowLayout]);

  return (
    <div className="h-screen overflow-hidden">
      {showLayout && <TopBar />}
      <div className="flex h-screen overflow-auto max-w-full">
        {showLayout && <Sidebar />}

        <div className="flex-1 bg-gray-100 text-black overflow-auto">
          <Routes>
            {/* Auth Routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Dashboard & Main */}
            <Route path="/dashboards/:deviceUid" element={<Dashboard />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/products" element={<Products />} />

            {/* Device */}
            <Route path="/devices" element={<Devices />} />
            <Route path="/device-overview" element={<DeviceOverview />} />
            <Route path="/device/:id" element={<DeviceDetail />} />
            <Route path="/controlsdevices" element={<ControlsDevice />} />
            <Route path="/controlsdevices/:deviceUid" element={<ControlsDevice />} />

            {/* Things / Pages */}
            <Route path="/things" element={<Things />} />

            {/* Test / Dev */}
            <Route path="/testaddpage" element={<TestAddPage />} />
            
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
