//import React from 'react';

function App() {
  // Dữ liệu giả lập (có thể thay thế bằng API)
  const devices = [
    { id: 1, name: "Device 1", status: "Online", lastModified: "2023-09-25", createdAt: "2023-01-01" },
    { id: 2, name: "Device 2", status: "Offline", lastModified: "2023-09-20", createdAt: "2023-01-05" }
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white h-full shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold">IoT-Farm</h1>
        </div>
        <ul>
          {["Dashboards", "Devices", "Things", "Products", "Sign In", "Sign Up"].map((item, index) => (
            <li key={index} className="p-4 hover:bg-gray-700 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border border-gray-300 p-2 rounded w-1/3 outline-none"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
            + Add Device
          </button>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr className="text-left">
                <th className="p-3">Device Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Modified</th>
                <th className="p-3">Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3">{device.name}</td>
                  <td className={`p-3 font-semibold ${device.status === "Online" ? "text-green-600" : "text-red-600"}`}>
                    {device.status}
                  </td>
                  <td className="p-3">{device.lastModified}</td>
                  <td className="p-3">{device.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
