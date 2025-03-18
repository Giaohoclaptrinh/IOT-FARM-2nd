import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-6">IOT FARM</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/dashboards" className="block p-2 hover:bg-gray-700 rounded">
              📊 Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/devices" className="block p-2 hover:bg-gray-700 rounded">
              📟 Devices
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/products" className="block p-2 hover:bg-gray-700 rounded">
              📦 Products
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/sign-in" className="block p-2 hover:bg-gray-700 rounded">
              🔑 Sign In
            </Link>
          </li>
          <li>
            <Link to="/sign-up" className="block p-2 hover:bg-gray-700 rounded">
              📝 Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
