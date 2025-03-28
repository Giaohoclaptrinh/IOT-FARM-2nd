import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/db.config"; // Import auth
import { collection, onSnapshot, doc, deleteDoc, query, where, addDoc } from "firebase/firestore";
import AddDevice from "../components/AddDevice";
import EditDevice from "../components/EditDevice";

const DeviceList = ({ setSelectedDevice }) => {
  const itemsPerPage = 15;
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Tất cả");
  const [showEditDevice, setShowEditDevice] = useState(false);
  const [selectedDeviceData, setSelectedDeviceData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newDevice, setNewDevice] = useState({ name: "", description: "", location: "" });

  // Lấy user hiện tại
  useEffect(() => {

    
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      console.log("User đăng nhập:", user); // Kiểm tra giá trị user
      setUser(user);
    });
    return () => unsubscribeAuth();
  }, []);
  

  // Lấy danh sách thiết bị từ Firestore
  useEffect(() => {
    if (!user) {
      setDevices([]); // Nếu user null thì không hiển thị gì
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "devices"), where("userUID", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(deviceData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddDevice = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để thêm thiết bị!");
      return;
    }

    try {
      await addDoc(collection(db, "devices"), {
        name: newDevice.name.trim() || "Không có tên",
        description: newDevice.description.trim(),
        location: newDevice.location.trim(),
        status: "Offline",
        userUID: user?.uid || "unknown", 
        createdAt: new Date(),
      });

      alert("Thiết bị đã được thêm thành công!");
      setShowAddDevice(false);
      setNewDevice({ name: "", description: "", location: "" });
    } catch (error) {
      console.error("Lỗi khi thêm thiết bị:", error);
      alert("Có lỗi xảy ra khi thêm thiết bị.");
    }
  };

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

  const filteredDevices = devices.filter(
    (device) =>
      selectedLocation === "Tất cả" ||
      (selectedLocation === "Unknown device"
        ? !device.location || device.location.trim() === ""
        : device.location === selectedLocation)
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);

  return (
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : !user ? (
        <p className="text-red-500">Bạn cần đăng nhập để xem thiết bị của mình.</p>
      ) : (
        <>
          <select
            className="border p-2 rounded mb-4"
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
          >
            {["Tất cả", ...new Set(devices.map((d) => d.location || "Unknown device"))].map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
            onClick={() => setShowAddDevice(true)}
          >
            + Thêm thiết bị
          </button>

          {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} onAddDevice={handleAddDevice} />}

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
                    <p className="text-sm text-gray-600">Mô tả: {device.description || ""}</p>
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
        </>
      )}
    </div>
  );
};

export default DeviceList;


// import React, { useEffect, useState } from "react";
// import { db } from "../firebase/db.config";
// import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import AddDevice from "../components/AddDevice";
// import EditDevice from "../components/EditDevice"; // Đảm bảo đường dẫn đúng

// const DeviceList = ({ setSelectedDevice }) => {
//   const itemsPerPage = 15;
//   const [devices, setDevices] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddDevice, setShowAddDevice] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState("Tất cả");
//   const [showEditDevice, setShowEditDevice] = useState(false);
//   const [selectedDeviceData, setSelectedDeviceData] = useState(null);

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

//   const handleEdit = (device) => {
//     setSelectedDeviceData(device);
//     setShowEditDevice(true);
//   };

//   const handleDelete = async (deviceId) => {
//     if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
//       try {
//         await deleteDoc(doc(db, "devices", deviceId));
//       } catch (error) {
//         console.error("Lỗi khi xóa thiết bị:", error);
//       }
//     }
//   };

//   // Lọc thiết bị theo vị trí
//   const filteredDevices = devices.filter(
//     (device) =>
//       selectedLocation === "Tất cả" ||
//       (selectedLocation === "Unknown device"
//         ? !device.location || device.location.trim() === ""
//         : device.location === selectedLocation)
//   );

//   // Tạo danh sách vị trí duy nhất
//   const uniqueLocations = ["Tất cả", ...new Set(devices.map((d) => d.location || "Unknown device"))];

//   // Phân trang dựa trên danh sách đã lọc
//   const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const selectedDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Danh Sách Thiết Bị</h1>

//       {/* Bộ lọc vị trí */}
//       <select
//         className="border p-2 rounded mb-4"
//         value={selectedLocation}
//         onChange={(e) => {
//           setSelectedLocation(e.target.value);
//           setCurrentPage(1);
//         }}
//       >
//         {uniqueLocations.map((location, index) => (
//           <option key={index} value={location}>
//             {location}
//           </option>
//         ))}
//       </select>

//       {/* Nút thêm thiết bị */}
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-800 transition"
//         onClick={() => setShowAddDevice(true)}
//       >
//         + Thêm thiết bị
//       </button>

//       {showAddDevice && <AddDevice onClose={() => setShowAddDevice(false)} />}

//       {/* Danh sách thiết bị */}
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
//                 <p className="text-sm text-gray-600">
//                   Mô tả: {device.description ? device.description : ""}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Vị trí: {device.location ? device.location : "Unknown device"}
//                 </p>
//                 <p className={`text-sm ${device.status === "Online" ? "text-green-500" : "text-red-500"}`}>
//                   {device.status}
//                 </p>
//               </div>
//               <div className="space-x-2">
//                 <button
//                   className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleEdit(device);
//                   }}
//                 >
//                   Sửa
//                 </button>
//                 <button
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(device.id);
//                   }}
//                 >
//                   Xóa
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">Không có thiết bị nào ở vị trí này.</p>
//         )}
//       </div>

//       {/* Form chỉnh sửa thiết bị */}
//       {showEditDevice && (
//         <EditDevice 
//           device={selectedDeviceData} 
//           onClose={() => setShowEditDevice(false)} 
//         />
//       )}

//       {/* Thanh chuyển trang */}
//       {totalPages > 1 && (
//         <div className="fixed bottom-0 left-0 w-full border-l-orange-50shadow-md p-4 flex justify-center items-center space-x-2">
//           <button
//             className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Trang trước
//           </button>
//           <span>
//             Trang {currentPage} / {totalPages}
//           </span>
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
