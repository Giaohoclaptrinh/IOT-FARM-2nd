// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
// import Sidebar from "./components/SideBar/Sidebar";
// import TopBar from "./components/TopBar and Search/TopBar";
// import Dashboard from "./pages/Dashboard";
// import Devices from "./pages/Devices";
// import Products from "./pages/Products";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import DeviceOverview from "./components/Devices/DeviceOverview";
// import ProfileSettings from "./pages/ProfileSettings";
// import DeviceDetail from "./components/Devices/DeviceDetail";

// import UserPage from "./pages/User";
// import ChatBox from "@/components/Chatbox/Chatbox.jsx";

// const App = () => {
//   const [showLayout, setShowLayout] = useState(true);

//   return (
//     <Router>
//       <MainContent showLayout={showLayout} setShowLayout={setShowLayout} />
//     </Router>
//   );
// };

// const MainContent = ({ showLayout, setShowLayout }) => {
//   const location = useLocation();
//   const isAuthPage = location.pathname === "/sign-in" || location.pathname === "/sign-up";

//   return (
//     <div className="overflow-hidden h-screen">
//       {showLayout && !isAuthPage && <TopBar />}
//       <div className="flex h-screen overflow-auto max-w-full">
//         {showLayout && !isAuthPage && <Sidebar />}
//         <div className="flex-1 bg-gray-100">
//           <div className="text-black h-full max-w-full overflow-auto bg-gray-100 overflow-x-auto">
//             <Routes>
//               <Route path="/dashboards/:deviceUid" element={<Dashboard />} />
//               <Route path="/user" element={<UserPage />} />
//               <Route path="/Sidebar" element={<Sidebar />} />
//               <Route path="/devices" element={<Devices />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/profile-settings" element={<ProfileSettings />} />
//               <Route path="/sign-in" element={<SignIn setShowLayout={setShowLayout} />} />
//               <Route path="/sign-up" element={<SignUp setShowLayout={setShowLayout} />} />
//               <Route path="/device-overview" element={<DeviceOverview />} />
//               <Route path="/device/:id" element={<DeviceDetail />} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/SideBar/Sidebar";
import TopBar from "./components/TopBar and Search/TopBar";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Products from "./pages/Products";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DeviceOverview from "./components/Devices/DeviceOverview";
import ProfileSettings from "./pages/ProfileSettings";
import DeviceDetail from "./components/Devices/DeviceDetail";
import UserPage from "./pages/User";
import ChatBox from "@/components/Chatbox/Chatbox.jsx";

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

  // Kiểm tra có phải trang đăng nhập/đăng ký không
  const isAuthPage = useMemo(() => {
    return ["/sign-in", "/sign-up"].includes(location.pathname);
  }, [location.pathname]);

  // Ẩn layout khi vào trang đăng nhập/đăng ký
  React.useEffect(() => {
    setShowLayout(!isAuthPage);
  }, [isAuthPage, setShowLayout]);

  return (
    <div className="  flex h-screen overflow-auto max-w-full">
      {!isAuthPage && <Sidebar />}
      <div className="overflow-hidden h-screen">
        {!isAuthPage && < TopBar />}
        <div className="flex-1 bg-gray-100">
          <div className="text-black h-full max-w-full overflow-auto bg-gray-100 overflow-x-auto">
            <Routes>
              <Route path="/dashboards/:deviceUid" element={<Dashboard />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/device-overview" element={<DeviceOverview />} />
              <Route path="/device/:id" element={<DeviceDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
