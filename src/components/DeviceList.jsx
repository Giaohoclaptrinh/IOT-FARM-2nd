// import React, { useEffect, useState } from "react";
// import { db } from "../firebase/db.config";
// import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import AddDevice from "../components/AddDevice";

// const DeviceList = () => {
//   const [devices, setDevices] = useState([]);
//   const [showAddDevice, setShowAddDevice] = useState(false);

//   useEffect(() => {
//     // Lắng nghe dữ liệu từ Firestore theo thời gian thực
//     const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
//       const deviceData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setDevices(deviceData);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Xóa thiết bị theo ID
//   const handleDelete = async (deviceId) => {
//     if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
//       try {
//         await deleteDoc(doc(db, "devices", deviceId));
//         alert("Thiết bị đã được xóa thành công!");
//       } catch (error) {
//         console.error("Lỗi khi xóa thiết bị:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>

//       {/* Nút mở form thêm thiết bị */}
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
//         onClick={() => setShowAddDevice(true)}
//       >
//         + Thêm thiết bị
//       </button>

//       {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}

//       <ul className="space-y-2">
//         {devices.length > 0 ? (
//           devices.map((device) => (
//             <li key={device.name} className="p-4 bg-gray-100 rounded shadow-md flex justify-between items-center hover:bg-gray-400 transition">
//               <div>
//                 <h3 className="text-lg font-semibold">{device.name || "Không có tên"}</h3>
//                 {/* <p>Loại: {device.type}</p> */}
//                 <p>Trạng thái: {device.status}</p>
//               </div>
//               <button
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                 onClick={() => handleDelete(device.id)}
//               >
//                 Xóa
//               </button>
//             </li>
//           ))
//         ) : (
//           <p className="text-gray-500">Chưa có thiết bị nào.</p>
//         )}
//       </ul>
//     </div>
//   );




//   // return (
//   //   <div className="bg-white p-6 rounded-lg shadow-md">
//   //     <h2 className="text-2xl font-bold mb-4 text-gray-800">📡 Danh Sách Thiết Bị</h2>

//   //     <button className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
//   //       + Thêm thiết bị
//   //     </button>

//   //     <div className="space-y-4">
//   //       {devices.map((device) => (
//   //         <div
//   //           key={device.id}
//   //           className="flex justify-between items-center p-4 rounded-lg shadow-sm bg-gray-50 border border-gray-200 
//   //                      hover:shadow-md transition cursor-pointer"
//   //           onClick={() => setSelectedDevice(device.id)}
//   //         >
//   //           <div>
//   //             <h3 className="font-semibold text-lg text-gray-700">{device.name}</h3>
//   //             <p
//   //               className={`text-sm font-medium ${
//   //                 device.status === "Online" ? "text-green-500" : "text-red-500"
//   //               }`}
//   //             >
//   //               🔵 Trạng thái: {device.status}
//   //             </p>
//   //           </div>

//   //           <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
//   //             ❌ Xóa
//   //           </button>
//   //         </div>
//   //       ))}
//   //     </div>
//   //   </div>
//   // );
// };



// export default DeviceList;
// import React, { useEffect, useState } from "react";
// import { db } from "../firebase/db.config";
// import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import AddDevice from "../components/AddDevice";

// const DeviceList = ({ setSelectedDevice }) => {
//   const itemsPerPage = 5;
//   const [devices, setDevices] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddDevice, setShowAddDevice] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState("Tất cả");

//   const uniqueLocations = ["Tất cả", ...new Set(devices.map(d => d.location || "Unknown device"))];

//   const filteredDevices = devices.filter(device => 
//   selectedLocation === "Tất cả" || device.location === selectedLocation
// );


//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
//       const deviceData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setDevices(deviceData);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleDelete = async (deviceId) => {
//     if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
//       try {
//         await deleteDoc(doc(db, "devices", deviceId));
//         alert("Thiết bị đã được xóa thành công!");
//       } catch (error) {
//         console.error("Lỗi khi xóa thiết bị:", error);
//       }
//     }
//   };

//   const totalPages = Math.ceil(devices.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const selectedDevices = devices.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>
//       <select 
//   className="border p-2 rounded mb-4"
//   value={selectedLocation}
//   onChange={(e) => setSelectedLocation(e.target.value)}
// >
//   {uniqueLocations.map((location, index) => (
//     <option key={index} value={location}>{location}</option>
//   ))}
// </select>

//       <div>
//   <h3 className="font-semibold">{device.name || "Không có tên"}</h3>
//   <p className="text-sm text-gray-600">
//     Vị trí: {device.location ? device.location : "Unknown device"}
//   </p>
//   <p className={`text-sm ${device.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
//     {device.status}
//   </p>
// </div>

//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
//         onClick={() => setShowAddDevice(true)}
//       >
//         + Thêm thiết bị
//       </button>

//       {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {selectedDevices.length > 0 ? (
//           selectedDevices.map((device) => (
//             <div
//               key={device.id}
//               className="p-4 rounded-lg shadow cursor-pointer bg-white flex justify-between items-center"
//               onClick={() => setSelectedDevice(device.id)}
//             >
//               <div>
//                 <h3 className="font-semibold">{device.name || "Không có tên"}</h3>
//                 <p className={`text-sm ${device.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
//                   {device.status}
//                 </p>
//               </div>
//               <button
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDelete(device.id);
//                 }}
//               >
//                 Xóa
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">Chưa có thiết bị nào.</p>
//         )}
//       </div>

//       {/* Thanh chuyển trang */}
//       {totalPages > 1 && (
//         <div className="mt-4 flex justify-center items-center space-x-2">
//           <button
//             className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Trang trước
//           </button>
//           <span>Trang {currentPage} / {totalPages}</span>
//           <button
//             className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
//             onClick={() => setCurrentPage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Trang sau
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeviceList;

import React, { useEffect, useState } from "react";
import { db } from "../firebase/db.config";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AddDevice from "../components/AddDevice";
import EditDevice from "../components/EditDevice"; // Đảm bảo đường dẫn đúng

const DeviceList = ({ setSelectedDevice }) => {
  const itemsPerPage = 15;
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");
  const [showEditDevice, setShowEditDevice] = useState(false);
  const [selectedDeviceData, setSelectedDeviceData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
      const deviceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(deviceData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (device) => {
    setSelectedDeviceData(device);
    setShowEditDevice(true);
  };

  const handleDelete = async (deviceId) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      try {
        await deleteDoc(doc(db, "devices", deviceId));
      } catch (error) {
        console.error("Lỗi khi xóa thiết bị:", error);
      }
    }
  };

  // Lọc thiết bị theo vị trí
  const filteredDevices = devices.filter(
    (device) =>
      selectedLocation === "Tất cả" ||
      (selectedLocation === "Unknown device"
        ? !device.location || device.location.trim() === ""
        : device.location === selectedLocation)
  );

  // Tạo danh sách vị trí duy nhất
  const uniqueLocations = ["Tất cả", ...new Set(devices.map((d) => d.location || "Unknown device"))];

  // Phân trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>

      {/* Bộ lọc vị trí */}
      <select
        className="border p-2 rounded mb-4"
        value={selectedLocation}
        onChange={(e) => {
          setSelectedLocation(e.target.value);
          setCurrentPage(1);
        }}
      >
        {uniqueLocations.map((location, index) => (
          <option key={index} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* Nút thêm thiết bị */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
        onClick={() => setShowAddDevice(true)}
      >
        + Thêm thiết bị
      </button>

      {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}

      {/* Danh sách thiết bị */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedDevices.length > 0 ? (
          selectedDevices.map((device) => (
            <div
              key={device.id}
              className="p-4 rounded-lg shadow cursor-pointer bg-white flex justify-between items-center"
              onClick={() => setSelectedDevice(device.id)}
            >
              <div>
                <h3 className="font-semibold">{device.name || "Không có tên"}</h3>
                <p className="text-sm text-gray-600">
                  Mô tả: {device.description ? device.description : ""}
                </p>
                <p className="text-sm text-gray-600">
                  Vị trí: {device.location ? device.location : "Unknown device"}
                </p>
                <p className={`text-sm ${device.status === "Online" ? "text-green-500" : "text-red-500"}`}>
                  {device.status}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(device);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(device.id);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Không có thiết bị nào ở vị trí này.</p>
        )}
      </div>

      {/* Form chỉnh sửa thiết bị */}
      {showEditDevice && (
        <EditDevice 
          device={selectedDeviceData} 
          onClose={() => setShowEditDevice(false)} 
        />
      )}

      {/* Thanh chuyển trang */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 w-full border-l-orange-50shadow-md p-4 flex justify-center items-center space-x-2">
          <button
            className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
