import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "@/components/Home";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import Products from "@/pages/Products";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ProfileSettings from "@/pages/ProfileSettings";
import UserPage from "@/pages/User";
import DeviceOverview from "@/components/Devices/DeviceOverview";
import DeviceDetail from "@/components/Devices/DeviceDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Các trang có giao diện Home */}
        <Route path="/" element={<Home />}>
          <Route path="/dashboards" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/products" element={<Products />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/device-overview" element={<DeviceOverview />} />
          <Route path="/device/:id" element={<DeviceDetail />} />
        </Route>

        {/* Các trang không có layout Home */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
