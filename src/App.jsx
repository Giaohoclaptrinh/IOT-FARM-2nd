import React, { useState, useMemo, useEffect } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";


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
import HomePage from "./pages/HomePage";
import Testdevice from "./components/Devices/testdevice";
import StreamDevice from "./pages/StreamDevice";

const App = () => {
    const [showLayout, setShowLayout] = useState(true);

    return (
            <Router>
                <MainContent
                    showLayout={showLayout}
                    setShowLayout={setShowLayout}
                />
            </Router>
    );
};

const MainContent = ({ showLayout, setShowLayout }) => {
    const location = useLocation();

    const isAuthPage = useMemo(() => {
        return ["/sign-in", "/sign-up"].includes(location.pathname);
    }, [location.pathname]);

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
                        <Route path="/" element={<HomePage />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />

                        {/* Dashboard & Main */}
                        <Route
                            path="/dashboards/:deviceUid"
                            element={<Dashboard />}
                        />
                        <Route path="/user" element={<UserPage />} />
                        <Route
                            path="/profile-settings"
                            element={<ProfileSettings />}
                        />
                        <Route
                            path="/testdevice"
                            element={<Testdevice />}
                        />
                        <Route path="/products" element={<Products />} />

                        {/* Device */}
                        <Route path="/devices" element={<Devices />} />
                        <Route path="/devices/:id" element={<Devices />} />
                        <Route path="/devices/stream/:id" element={<StreamDevice />} />
                        <Route
                            path="/device-overview"
                            element={<DeviceOverview />}
                        />
                        <Route path="/device/:id" element={<DeviceDetail />} />
                        <Route
                            path="/controlsdevices"
                            element={<ControlsDevice />}
                        />
                        <Route
                            path="/controlsdevices/:deviceUid"
                            element={<ControlsDevice />}
                        />

                        {/* Things / Pages */}
                        <Route path="/things" element={<Things />} />
                        <Route path="/things/:id" element={<Things />} />
                        
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;
