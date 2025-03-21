// import React from "react";
//import { auth } from "../firebase/db.config";
//import { signOut } from "firebase/auth";
//import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return(
  <div className="w-64 bg-gray-900 text-white h-screen max-w-full overflow-y-hidden  p-4 flex flex-col">
  <h2 className="text-xl font-bold mb-4">IoT-Farm</h2>
  <ul className="flex-grow">
    <li>
      <Link to="/dashboards" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
    </li>
    <li>
      <Link to="/devices" className="block p-2 hover:bg-gray-700 rounded">Devices</Link>
    </li>
    <li>
      <Link to="/products" className="block p-2 hover:bg-gray-700 rounded">Products</Link>
    </li>
    
  </ul>
    <div className="mt-auto">
    
          <Link to="/profile-settings" className="block p-2 hover:bg-gray-700">Cài đặt hồ sơ</Link>
    </div>
</div>
);

};

export default Sidebar;
